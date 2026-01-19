import Link from "next/link";

export default async function Privacy() {
  return (
    <section className="terms-sec common-sec">
      <div className="container">
        <div className="terms-con">
          <div className="sec-head">
            <h1 className="sec-title">Privacy Policy</h1>
          </div>
          <div className="cms-con">
            <p>
              <strong>Effective Date:</strong> 24 November 2024
            </p>
            <p>
              <strong>Dollar Sign Club</strong>
              {`("we," "us," or "our")`} is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website,{" "}
              <strong>
                <Link href={"/"}>dollarsignclub.com</Link>
              </strong>
              {`(the "Site")`}, and use our document signing services.
            </p>
            <p>
              By using our Site and services, you agree to the practices
              described in this Privacy Policy. If you do not agree, please do
              not use the Site.
            </p>
            <h4>1. Information We Collect</h4>
            <p>
              We collect the following types of information when you use our
              services:
            </p>
            <ul>
              <li>
                <strong>Personal Information</strong>
                <ul>
                  <li>
                    <strong>Contact Details:</strong> Name, email address, and
                    phone number.
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing details
                    required for processing payments.
                  </li>
                  <li>
                    <strong>Identification Data:</strong> Information you may
                    provide to verify your identity (if applicable).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Document Data</strong>
                <ul>
                  <li>Uploaded documents for signature.</li>
                  <li>
                    Signatory details, such as names, email addresses, and
                    signatures.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Technical Information</strong>
                <ul>
                  <li>IP address, browser type, and operating system.</li>
                  <li>Cookies and usage data for analytics and performance.</li>
                </ul>
              </li>
            </ul>
            <h4>2. How We Use Your Information</h4>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To provide, maintain, and improve our services.</li>
              <li>To process payments and complete transactions.</li>
              <li>
                To send transactional emails, including notifications and
                confirmations.
              </li>
              <li>
                To comply with legal obligations and enforce our Terms of
                Service.
              </li>
            </ul>
            <h4>3. How We Share Your Information</h4>
            <p>
              We do not sell or rent your personal information. However, we may
              share information in the following cases:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> With third-party service
                providers who assist with payment processing, data storage, and
                email delivery.
              </li>
              <li>
                <strong>Legal Requirements:</strong> To comply with applicable
                laws, regulations, or legal processes.
              </li>
              <li>
                <strong>Business Transactions:</strong> In the event of a
                merger, sale, or acquisition, your data may be transferred to a
                new entity.
              </li>
            </ul>
            <h4>4. Your Rights</h4>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul>
              <li>Access, correct, or delete your personal information.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <strong>
                <a href="mailto:sign@dollarsignclub.com">
                  sign@dollarsignclub.com
                </a>
              </strong>
              .
            </p>
            <h4>5. Data Retention</h4>
            <p>
              We retain your data only for as long as necessary to fulfill the
              purposes outlined in this policy or comply with legal obligations.
            </p>

            <h4>6. Data Security</h4>
            <p>
              We implement industry-standard security measures to protect your
              information. However, no method of transmission or storage is 100%
              secure. You acknowledge and agree that we cannot guarantee
              absolute security.
            </p>
            <h4>7. Cookies</h4>
            <p>
              We use cookies to enhance user experience and analyze Site
              performance. By using the Site, you consent to the use of cookies.
              You can manage cookie preferences through your browser settings.
            </p>

            <h4>8. Third-Party Links</h4>
            <p>
              Our Site may contain links to third-party websites. We are not
              responsible for the privacy practices or content of these
              websites.
            </p>

            <h4>9. Childrens Privacy</h4>
            <p>
              Our services are not intended for individuals under the age of 18.
              We do not knowingly collect personal information from minors.
            </p>

            <h4>10. Changes to This Policy</h4>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date. Continued
              use of the Site after changes constitute acceptance of the revised
              policy.
            </p>

            <h4>11. Contact Us</h4>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
              <br />
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
