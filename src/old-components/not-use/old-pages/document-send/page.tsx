import SignatoriesForm from "@/old-components/not-use/document-send/form";

export default async function DocumentSend({
  searchParams,
}: {
  searchParams: any;
}) {
  const { signers = 1, payment_status = "" } = await searchParams;
  return (
    <section className="upload-document-sec common-sec">
      <div className="container">
        <div className="upload-document-form">
          <SignatoriesForm signers={signers} payment_status={payment_status} />
        </div>
      </div>
    </section>
  );
}
