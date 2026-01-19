import Link from "next/link";

export default async function Terms() {
  return (
    <section className="terms-sec common-sec">
      <div className="container">
        <div className="terms-con">
          <div className="sec-head">
            <h1 className="sec-title">Terms and Conditions</h1>
          </div>
          <div className="cms-con">
            <p>
              <strong>Effective Date:</strong> 22 November 2024
            </p>
            <p>
              Welcome to <strong>Dollar Sign Club</strong> (“Company,” “we,”
              “our,” or “us”). By using our website,{" "}
              <strong>
                <Link href={"/"}>dollarsignclub.com</Link>
              </strong>{" "}
              (“Site”), or our services, you agree to be bound by these Terms
              and Conditions (“Terms”). If you do not agree with these Terms,
              you must not use our services.
            </p>

            <h4>1. Description of Service</h4>
            <p>
              Dollar Sign Club provides an online platform for electronic
              document signing. Each signatory is charged $1 per document. We do
              not offer subscriptions, additional fees, or contracts.
            </p>

            <h4>2. User Responsibilities</h4>
            <p>By using our services, you represent and warrant that:</p>
            <ul>
              <li>You are at least 18 years old.</li>
              <li>
                You have the legal authority to enter into agreements and sign
                documents electronically.
              </li>
              <li>
                You will use our services only for lawful purposes and in
                compliance with applicable laws and regulations.
              </li>
              <li>
                The content of the documents you upload and sign does not
                infringe on the rights of any third party or violate any laws.
              </li>
            </ul>

            <h4>3. Disclaimer of Liability</h4>
            <ul>
              <li>
                We provide a platform for document signing but do not guarantee
                the enforceability, validity, or legal compliance of any
                document signed through our platform.
              </li>
              <li>
                <strong>
                  {" "}
                  We are not responsible for verifying the identity, authority,
                  or intent of the parties using the platform.
                </strong>{" "}
                You are solely responsible for ensuring the legality of the
                documents signed through our services.
              </li>
              <li>
                <strong>
                  We do not provide legal, financial, or business advice.
                </strong>{" "}
                You should consult a qualified professional for advice specific
                to your needs.
              </li>
            </ul>

            <h4>4. Limitation of Liability</h4>
            <p>To the fullest extent permitted by law:</p>
            <ul>
              <li>
                Dollar Sign Club and its affiliates, officers, employees, and
                agents shall not be liable for any direct, indirect, incidental,
                special, consequential, or exemplary damages, including but not
                limited to damages for loss of profits, data, goodwill, or other
                intangible losses, resulting from:
                <ul>
                  <li>Your use or inability to use the Site or services.</li>
                  <li>Unauthorized access to or alteration of your data.</li>
                  <li>Actions taken by third parties through our platform.</li>
                  <li>Any other matter relating to the Site or services.</li>
                </ul>
              </li>
            </ul>

            <h4>5. Indemnification</h4>
            <p>
              You agree to indemnify, defend, and hold harmless Dollar Sign Club
              and its affiliates, officers, employees, and agents from and
              against all claims, damages, losses, liabilities, costs, and
              expenses (including reasonable attorneys’ fees) arising from:
            </p>
            <ul>
              <li>Your use of the Site or services.</li>
              <li>Your violation of these Terms.</li>
              <li>
                Your infringement of any third-party rights or applicable laws.
              </li>
            </ul>

            <h4>6. Intellectual Property</h4>
            <ul>
              <li>
                All content on the Site, including but not limited to text,
                graphics, logos, and software, is owned by Dollar Sign Club or
                licensed to us and protected under copyright, trademark, and
                other intellectual property laws.
              </li>
              <li>
                You may not reproduce, distribute, modify, or exploit our
                content without express written consent.
              </li>
            </ul>
            <h4>7. Privacy</h4>
            <p>
              Your use of the Site is also governed by our{" "}
              <strong>
                <Link href={"/privacy"}>Privacy Policy</Link>
              </strong>
              , which describes how we collect, use, and protect your personal
              data.
            </p>

            <h4>8. Termination</h4>
            <ul>
              <li>
                We reserve the right to suspend or terminate your access to the
                Site or services at our sole discretion, without notice, for any
                reason, including violation of these Terms.{" "}
              </li>
              <li>
                Upon termination, your right to use the Site and services will
                cease immediately.
              </li>
            </ul>

            <h4>9. Dispute Resolution</h4>
            <ul>
              <li>
                <strong>Governing Law:</strong> These Terms shall be governed by
                and construed in accordance with the laws of Dubai, UAE.
              </li>
              <li>
                <strong>Arbitration:</strong> Any disputes arising under these
                Terms shall be resolved through binding arbitration in [Insert
                Location], and you waive your right to a jury trial.
              </li>
              <li>
                <strong>Class Action Waiver:</strong> You agree to resolve any
                disputes individually and waive your right to participate in a
                class action lawsuit or class-wide arbitration.
              </li>
            </ul>
            <h4>10. Changes to the Terms</h4>
            <p>
              We may update these Terms from time to time. Any changes will be
              effective immediately upon posting on the Site. Your continued use
              of the Site or services after the posting of revised Terms
              constitutes your acceptance of such changes.
            </p>
            <h4>11. Entire Agreement</h4>
            <p>
              These Terms, along with our Privacy Policy, constitute the entire
              agreement between you and Dollar Sign Club regarding the use of
              our Site and services, superseding any prior agreements.
            </p>

            <h4>12. Contact Information</h4>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:sign@dollarsignclub.com">
                sign@dollarsignclub.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
