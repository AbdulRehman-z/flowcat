"use server"

import { auth } from "@/auth";
import { db, userSavedJobs } from "@/db";
import { Job } from "@/types/jobs";

export const SaveJobAction = async (data: Job) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const jobData = {
      title: data.title ?? "", // Provide default if undefined
      description: data.description ?? "",
      clientBudget: data.clientBudget ?? "",
      jobType: data.jobType ?? "",
      userId: userId,
      posted: data.posted ?? "",
      duration: data.duration ?? "",
      experienceLevel: data.experienceLevel ?? "",
      applyUrl: data.applyUrl ?? "",
      tokens: data.tokens ?? "",
      clientName: data.clientName ?? "",
      platform: data.platform ?? ""
    };

    await db.insert(userSavedJobs)
      .values(jobData)
      .onConflictDoNothing({
        target: [userSavedJobs.userId, userSavedJobs.title]
      });

  } catch (error) {
    console.error(error);
    throw error;
  }
};
