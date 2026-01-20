export default async function About() {
  return (
    <section className="about-sec common-sec">
      <div className="container">
        <div className="about-con">
          <div className="cms-con">
            <h1>
              At Contract Sign, we believe <br />
              that e-signatures should be <br />
              simple, affordable, and accessible <br />
              for everyone.
            </h1>
            <div className="about-video">
              <video poster="/images/about.jpg" controls>
                <source src="/images/about.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p>
              Tired of expensive subscription models and hidden fees, we set out
              to create a straightforward service where you only pay for what
              you use—just $1 per signatory, no more, no less. Whether youre a
              freelancer needing to sign the occasional contract, a small
              business looking to cut costs, or an individual managing personal
              agreements, Contract Sign is the easiest, most affordable way
              to get documents signed online.
            </p>
            <p>
              Were focused on making your life easier with fast, legally binding
              e-signatures that you can rely on. Theres no need for long-term
              commitments, confusing pricing structures, or complicated
              software—just upload your document, pay $1 per signer, and get it
              signed quickly and securely. <br />
              Our mission is to bring transparency and simplicity to the world
              of e-signatures, so you can focus on what really matters—your
              business, your work, and your life.
            </p>
            <div className="about-blue-sky-logo">
              <img src="images/blue-sky.jpg" alt="blue-sky" />
            </div>
            <p>
              <b>Part of the Blue-Sky Thinking Ventures Portfolio</b>
              <br />
              Contract Sign is proud to be a Blue-Sky Thinking Venture, part
              of a broader venture studio portfolio that supports innovation and
              forward-thinking businesses. As part of this community, we’re
              committed to delivering creative solutions that redefine industry
              standards while keeping things simple and user-friendly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
