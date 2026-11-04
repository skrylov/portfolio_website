import { useParams } from 'react-router'

export default function CaseStudyPage() {
  const { slug } = useParams()

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Case-study placeholder</h1>
      <p>Route slug: {slug}</p>
    </>
  )
}
