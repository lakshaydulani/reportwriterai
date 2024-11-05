import KnowledgebaseDropzone from "@/components/tailwind/ui/knowledgebaseDropzone";
import Link from "next/link";
const KnowledgeBase = () => {
  return (
    <section className='section'>
      <div className='container '>
        <div className="flex">
          <h1 className='title text-3xl font-bold w-[95%]'>Upload Files</h1>
          <Link
            href='/'
          >
            <button className="bg-header-grey text-white m-4 p-5 rounded-full">
              BACK
            </button>
          </Link>
        </div>
        <KnowledgebaseDropzone className='p-16 mt-10 border border-neutral-200' />
        </div>
    </section>
  )
}

export default KnowledgeBase;