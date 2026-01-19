import { getEnvelopes } from "@/old-actions/getEnvelopes";
import MyAccountList from "@/old-components/not-use/my-account";

export default async function MyAccount() {
  const envelopesList = await getEnvelopes();
  // console.log(envelopesList?.data?.data);

  return (
    <section className="my-account-sec common-sec">
      <div className="container">
        <div className="my-account-con">
          <label htmlFor="" className="form-label">
            My Account
          </label>
          <div className="table-responsive">
            <MyAccountList data={envelopesList?.data?.data} />
          </div>
        </div>
      </div>
    </section>
  );
}
