import KnowledgebaseDropzone from "@/components/tailwind/ui/knowledgebaseDropzone";
const KnowledgeBase = () => {
  return (
    <section className='section'>
      <div className='container'>
        <h1 className='title text-3xl font-bold '>Upload Files</h1>
        <KnowledgebaseDropzone className='p-16 mt-10 border border-neutral-200' />
      </div>
    </section>
  )
}

export default KnowledgeBase;