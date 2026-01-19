import UploadDocumentForm from "@/old-components/not-use/upload-document/form";

export default async function UploadDocument({
  searchParams,
}: {
  searchParams: any;
}) {
  const { signers = 1 } = await searchParams;
  return (
    <section className="upload-document-sec common-sec">
      <div className="container">
        <UploadDocumentForm signers={signers} />
      </div>
    </section>
  );
}
