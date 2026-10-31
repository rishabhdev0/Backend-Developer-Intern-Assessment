// F13: unique metadata per dynamic page (example: app/careers/[slug]/page.tsx)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug); // placeholder data source
  return {
    title: `${job.title} | Careers at Cynbit`,
    description: job.summary, // a job summary, not form/consent text
    alternates: { canonical: `/careers/${params.slug}` },
  };
}

// Prerender every slug at build time
export async function generateStaticParams() {
  const jobs = await getAllJobs(); // placeholder data source
  return jobs.map((j) => ({ slug: j.slug }));
}
