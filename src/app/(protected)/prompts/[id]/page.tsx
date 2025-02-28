export default async function PromptPage({ params }: { params: { id: string } }) {
  const prompt = await getPrompt(params.id)
  
  if (!prompt) {
    notFound()
  }
  
  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
      <Suspense fallback={<PromptDetailsSkeleton />}>
        <PromptDetails promptId={params.id} initialData={prompt} />
      </Suspense>
    </div>
  )
} 