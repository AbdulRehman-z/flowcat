// export type Job = {
//   id: string
//   title: string
//   price: {
//     amount: number
//     type: "Fixed" | "Hourly"
//   }
//   description: string
//   experience: string
//   // skills: string[]
//   client: {
//     name: string
//     score: number
//     spent: string
//     hireRate: number
//     location: string
//     jobsPosted: number
//     activeHires: number
//   }
//   posted: string
// }


export enum Platform {
  UPWORK = "Upwork",
  FREELANCER = "Freelancer",
  GURU = "Guru",
}


export type Job = {
  platform: Platform;
  posted: string;
  title: string;
  jobType: string;
  experienceLevel: string;
  clientBudget: string;
  duration: string;
  tokens: string[];
}
