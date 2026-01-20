"use client";

import { Accordion } from "react-bootstrap";

export default function HomeFAQ() {
  return (
    <Accordion className="accordion accordion-flush" defaultActiveKey="1">
      <Accordion.Item eventKey="1">
        <Accordion.Header>How much does it cost?</Accordion.Header>
        <Accordion.Body>
          <p>$1 per signature.</p>
          <p>
            Simple. If you have 2 people signing a document, it is $1 per
            signature, so the total is $2. And so on. We have removed all
            contracts, all obligations to make our service as simple for you to
            use!
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header> Is it legally binding?</Accordion.Header>
        <Accordion.Body>
          <p>Yes, the Contract Sign envelopes are legally binding.</p>
          <p>
            Our electronic signatures are globally recognized and legally
            binding, offering the same legal standing as traditional ink
            signatures on paper.
          </p>
          <p>
            <strong>ESIGN Act.</strong>
          </p>
          <p>
            The Electronic Signatures in Global and National Commerce (ESIGN)
            Act, passed in 2000, legally recognizes electronic signatures and
            records in US commerce.
          </p>
          <p>
            <strong>UETA.</strong>
          </p>
          <p>
            he Uniform Electronic Transactions Act (UETA) aims to provide
            uniformity and consistency across states in the US by standardizing
            the legal treatment of electronic records and signatures
          </p>
          <p>
            <strong>eIDAS.</strong>
          </p>
          <p>
            The Electronic Identification and Trust Services (eIDAS) Regulation,
            effective since 2016, standardizes and legally recognizes electronic
            signatures across the European Union. Our signatures are classified
            as eIDAS SES.
          </p>
          <p>
            <strong>International Electronic Signature Laws.</strong>
          </p>
          <p>
            Several international regulations recognize the legality of
            electronic signatures, ensuring their validity and enforceability in
            many jurisdictions around the globe.
          </p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>What file types can I upload?</Accordion.Header>
        <Accordion.Body>
          <p>You can upload a PDF or docx file formats.</p>
          <p>
            Your file will be appended with a signature page for all parties to
            sign.
          </p>
          <p>
            You cannot add any other text via the tool, so please ensure all
            text is complete in the document as no users will be able to add any
            further information to documents once sent for signing.
          </p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
