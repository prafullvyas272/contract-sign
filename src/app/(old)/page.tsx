import HomeFAQ from "@/old-components/home/faq";
import HomeForm from "@/old-components/home/form";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="hero-sec common-sec">
        <div className="container">
          <div className="row">
            <div className="col-sm-7">
              <div className="hero-con">
                <div className="sec-head">
                  <h1 className="sec-title">
                    Sign Legally Binding Documents for Just $1. No
                    Subscriptions, No Hidden Fees, No Contracts.
                  </h1>
                  <p>
                    Simple, fast, and affordable e-signatures at your
                    fingertips.
                  </p>
                </div>
                <div className="cms-con">
                  <ul>
                    <li>PAY FOR WHAT YOU NEED</li>
                    <li>NO ADDITIONAL FEES</li>
                    <li>NO COMMITMENTS</li>
                    <li>USE AS AND WHEN YOU WANT</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="signing-form">
                <HomeForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="how-it-works-sec common-sec pt-0">
        <div className="container">
          <div className="how-it-works-con">
            <div className="sec-head style-2 text-center">
              <h2 className="sec-title">HOW IT WORKS</h2>
              <p>Get Your Documents Signed in 3 Easy Steps.</p>
            </div>
            <div className="how-it-works-boxes">
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="how-it-works-box">
                    <div className="how-it-works-box-img">
                      <img src="images/upload.svg" alt="upload" />
                    </div>
                    <div className="how-it-works-box-con">
                      <div className="how-it-works-box-title">UPLOAD</div>
                      <span>
                        Drag and drop your file or select from your device. We
                        accept PDFs, Word docs, and more.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="how-it-works-box">
                    <div className="how-it-works-box-img">
                      <img src="images/pay.svg" alt="pay" />
                    </div>
                    <div className="how-it-works-box-con">
                      <div className="how-it-works-box-title">PAY</div>
                      <span>
                        No subscriptions or hidden fees—just $1 per signatory.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="how-it-works-box">
                    <div className="how-it-works-box-img">
                      <img src="images/send.svg" alt="send" />
                    </div>
                    <div className="how-it-works-box-con">
                      <div className="how-it-works-box-title">SEND</div>
                      <span>
                        We’ll email your document to the signers. Once signed,
                        you’ll receive it instantly.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href={"/dashboard/contracts/new"}
                className="btn btn-outline-primary"
              >
                UPLOAD NOW <i className="icon-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="why-dollar-sec common-sec pt-0">
        <div className="container">
          <div className="why-dollar-con">
            <div className="sec-head style-2 text-center">
              <h3 className="sec-title">Why Dollar Sign Club?</h3>
              <p>Why Pay More? Get Everything You Need for Just $1.</p>
            </div>
            <div className="why-dollar-boxes">
              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="why-dollar-box">
                    <div className="why-dollar-box-img">
                      <img src="images/save-money.svg" alt="save-money" />
                    </div>
                    <span>Save money</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="why-dollar-box">
                    <div className="why-dollar-box-img">
                      <img src="images/save-time.svg" alt="save-time" />
                    </div>
                    <span>Save time</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="why-dollar-box">
                    <div className="why-dollar-box-img">
                      <img src="images/easy-to-use.svg" alt="easy-to-use" />
                    </div>
                    <span>Easy to use</span>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="why-dollar-box">
                    <div className="why-dollar-box-img">
                      <img
                        src="images/legally-compliant.svg"
                        alt="legally-compliant"
                      />
                    </div>
                    <span>Legally compliant</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href={"/dashboard/contracts/new"}
                className="btn btn-outline-primary"
              >
                UPLOAD NOW <i className="icon-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="who-it-sec common-sec">
        <div className="container">
          <div className="who-it-con">
            <div className="sec-head style-2 text-center">
              <h3 className="sec-title">Who Is It For?</h3>
              <p>Perfect for Businesses and Individuals.</p>
            </div>
            <div className="who-it-boxes">
              <div className="row">
                <div className="col-md-6">
                  <div className="who-it-box">
                    <div className="who-it-box-title">FOR BUSINESSES</div>
                    <p>
                      Save on expensive subscription fees—ideal for small
                      businesses, freelancers, and occasional users.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="who-it-box">
                    <div className="who-it-box-title">FOR INDIVIDUALS</div>
                    <p>
                      Quickly sign personal contracts, agreements, and forms for
                      just $1.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-sec common-sec">
        <div className="container">
          <div className="faq-con">
            <div className="sec-head style-2 text-center">
              <h3 className="sec-title">FAQ</h3>
              <p>Frequently Asked Questions</p>
            </div>
            <HomeFAQ />
          </div>
        </div>
      </section>
      <section className="get-started-sec common-sec">
        <div className="container">
          <div className="get-started-con">
            <div className="sec-head style-2 text-center">
              <h3 className="sec-title">
                GET STARTED TODAY WITH no commitment. just use what you need and
                be happy.
              </h3>
            </div>
            <div className="text-center">
              <a
                href={"/dashboard/contracts/new"}
                className="btn btn-outline-dark"
              >
                GET STARTED FOR <br />
                $1 <i className="icon-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
