"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createStripeSession } from "@/old-actions/createStripeSession";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createEnvelope } from "@/old-actions/createEnvelope";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import apiClient from "@/old-http/apiClient";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(publishableKey);

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  message: yup.string().required("Message is required"),
  signatories: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
  ),
});

const SignatoriesForm = ({
  signers,
  payment_status,
}: {
  signers: any;
  payment_status: any;
}) => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedTools, setSelectedTools] = useState(["SIGNATURE"]);
  const [lastPage, setLastPage] = useState(1);
  const [tempFileLocation, setTempFileLocation] = useState("");
  const [tempFileType, setTempFileType] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const errorRef = useRef<any>(null);
  const successRef = useRef<any>(null);

  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      message: "",
      signatories: [{ name: "", email: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "signatories",
  });

  useEffect(() => {
    const savedEnvelopeData = localStorage.getItem("envelopeData");
    if (savedEnvelopeData) {
      const parsedData = JSON.parse(savedEnvelopeData);
      reset({
        title: parsedData.title,
        message: parsedData.message,
      });

      const existingSignatories = parsedData.recipients.map(
        (recipient: any) => ({
          name: recipient.name,
          email: recipient.email,
        }),
      );

      replace(existingSignatories);
    }
  }, [reset]);

  useEffect(() => {
    const rawTempFileLocation = localStorage.getItem("tempFileLocation");
    const rawTempFileType = localStorage.getItem("tempFileType");
    const rawSelectedTools = localStorage.getItem("selectedTools");

    if (rawTempFileLocation) {
      setTempFileLocation(rawTempFileLocation);
    } else {
      router.push("/upload-document");
    }
    if (rawTempFileType) {
      setTempFileType(rawTempFileType);
    }
    if (rawSelectedTools) {
      setSelectedTools([rawSelectedTools]);
    }

    const envelopeData = localStorage.getItem("envelopeData");
    if (envelopeData !== null) {
      if (payment_status !== "") {
        if (payment_status === "success") {
          setSuccessMessage("Your payment has been successfully processed.");
          setIsPaymentSuccess(true);
          saveEnvelope(envelopeData);
        } else {
          setIsPaymentSuccess(false);
          setError("Your payment could not be completed. Please try again.");
        }
      }
    }

    if (
      signers !== null &&
      signers >= 0 &&
      !localStorage.getItem("envelopeData")
    ) {
      const newSignatories = Array.from({ length: signers }, () => ({
        name: "",
        email: "",
      }));
      replace(newSignatories);
    }
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [error, successMessage]);

  const handleToolSelect = (tool: any) => {
    setSelectedTools((prevTools) =>
      prevTools.includes(tool)
        ? prevTools.filter((t) => t !== tool)
        : [...prevTools, tool],
    );
    localStorage.setItem("selectedTools", tool);
  };

  let currentTop = 400;
  let currentLeft = 20;
  const maxItemsPerRow = 3;
  const itemSpacing = 200;
  let itemsInCurrentRow = 0;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: any }) => {
    setLastPage(numPages);
  };

  const onSubmit = async (data: any) => {
    try {
      setPaymentLoading(true);
      const envelopeData = {
        title: data.title,
        message: data.message,
        documents: [
          {
            url: tempFileLocation,
            format: tempFileType,
            fixed_positions: selectedTools
              .flatMap((tool, toolIndex) =>
                data.signatories.flatMap(
                  (signatory: any, signatoryIndex: any) => {
                    const isSignature = tool.toLowerCase() === "signature";
                    const height = isSignature ? 70 : 20;

                    if (itemsInCurrentRow >= maxItemsPerRow) {
                      currentTop += height + 40;
                      currentLeft = 20;
                      itemsInCurrentRow = 0;
                    }

                    const signaturePosition = {
                      place_key: `signer_${
                        signatoryIndex + 1
                      }_${tool.toLowerCase()}_here`,
                      page: lastPage,
                      top: currentTop,
                      left: currentLeft,
                    };

                    const namePosition = {
                      place_key: `signer_${signatoryIndex + 1}_name_here`,
                      page: lastPage,
                      top: currentTop + 20,
                      left: currentLeft,
                    };

                    const datePosition = {
                      place_key: `signer_${
                        signatoryIndex + 1
                      }_completed_date_here`,
                      page: lastPage,
                      top: currentTop + 40,
                      left: currentLeft,
                    };

                    currentLeft += itemSpacing;
                    itemsInCurrentRow++;

                    return isSignature
                      ? [signaturePosition, namePosition, datePosition]
                      : [signaturePosition];
                  },
                ),
              )
              .flat(),
            places: [
              ...data.signatories
                .flatMap((signatory: any, index: any) =>
                  selectedTools.flatMap((tool) => {
                    const isSignature = tool.toLowerCase() === "signature";

                    const signaturePlace = {
                      key: `signer_${index + 1}_${tool.toLowerCase()}_here`,
                      type: isSignature ? "signature" : "text",
                      recipient_key: `visitor${index + 1}`,
                      ...(tool.toLowerCase() !== "signature" && {
                        font_size: 14,
                        font_color: "#000000",
                        value: tool.toLowerCase(),
                      }),
                    };

                    const namePlace = isSignature
                      ? {
                          key: `signer_${index + 1}_name_here`,
                          type: "text",
                          value: signatory.name,
                          font_size: 12,
                          font_color: "#000000",
                          recipient_key: `visitor${index + 1}`,
                        }
                      : null;

                    const datePlace = isSignature
                      ? {
                          key: `signer_${index + 1}_completed_date_here`,
                          type: "recipient_completed_date",
                          recipient_key: `visitor${index + 1}`,
                          date_format: "MM/DD/YYYY, HH:MM A",
                        }
                      : null;

                    return isSignature
                      ? [signaturePlace, namePlace, datePlace]
                      : [signaturePlace];
                  }),
                )
                .flat(),
              ...(tempFileType === "pdf"
                ? [
                    {
                      key: "document_title",
                      type: "text",
                      value: data.title,
                    },
                    {
                      key: "signed_by_all_at",
                      type: "envelope_completed_date",
                      date_format: "MM/DD/YYYY, HH:MM A",
                    },
                  ]
                : []),
            ],
          },
        ],
        recipients: data.signatories.map((signatory: any, index: any) => ({
          type: "signer",
          key: `visitor${index + 1}`,
          name: signatory.name,
          email: signatory.email,
        })),
      };

      console.log(envelopeData);

      localStorage.setItem("envelopeData", JSON.stringify(envelopeData));

      const stripe: any = await stripePromise;
      const checkoutSession = await createStripeSession({
        name: data.title,
        quantity: fields.length,
      });
      if (checkoutSession.isSuccess) {
        const redirectToStripe = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data?.id,
        });
        if (redirectToStripe.error) {
          console.log(redirectToStripe.error);
        }
        setPaymentLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveEnvelope = async (data: any) => {
    try {
      setError("");
      setSuccessMessage("");
      const createEnvelopeApi = await createEnvelope(data);
      if (createEnvelopeApi.isSuccess && createEnvelopeApi?.data?.id) {
        await addEnvelopeId(createEnvelopeApi?.data?.id);
      } else {
        setError(createEnvelopeApi.data?.detail);
      }
      console.log(createEnvelopeApi);
    } catch (error) {
      console.log(error);
    }
  };

  const reSaveEnvelope = async () => {
    const envelopeData = localStorage.getItem("envelopeData");
    if (envelopeData !== null && isPaymentSuccess) {
      await saveEnvelope(envelopeData);
    }
  };

  const addEnvelopeId = async (id: any) => {
    setError("");
    const response = await apiClient.post("/add-id", {
      id,
    });
    if (response.status === 201) {
      localStorage.removeItem("envelopeData");
      localStorage.removeItem("tempFileLocation");
      localStorage.removeItem("tempFileType");
      localStorage.removeItem("selectedTools");
      router.push("/send-successful");
    } else {
      setError(response.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Document Title
          <br />
          <span style={{ fontSize: 13 }}>
            (Insert the title of this document so the receiving party can easily
            identify what they are signing)
          </span>
        </label>
        <input
          type="text"
          id="title"
          className="form-control"
          placeholder="Enter Title"
          {...register("title")}
        />
        {errors.title && (
          <div className="text-danger mt-3">{errors.title.message}</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Email Message
          <br />
          <span style={{ fontSize: 13 }}>
            (Please insert a short email message for the other signing parties
            to easily understand what they are signing)
          </span>
        </label>
        <input
          type="text"
          id="message"
          className="form-control"
          placeholder="Enter Message"
          {...register("message")}
        />
        {errors.message && (
          <div className="text-danger mt-3">{errors.message.message}</div>
        )}
      </div>
      {/* <div className="form-group">
        <label htmlFor="" className="form-label">
          Document Mark Up Tools
        </label>
        <div className="document-types">
          {["TEXTBOX", "NUMBER", "INITIALS", "SIGNATURE"].map((tool) => (
            <span
              key={tool}
              onClick={() => handleToolSelect(tool)}
              className={selectedTools.includes(tool) ? "selected" : ""}
            >
              {tool}
            </span>
          ))}
        </div>
      </div> */}
      <div className="form-group">
        <label htmlFor="" className="form-label">
          Document
        </label>
        {tempFileLocation !== "" && (
          <>
            {tempFileType === "pdf" && (
              <Document
                file={tempFileLocation}
                onLoadSuccess={onDocumentLoadSuccess}
                renderMode="none"
              >
                <Page pageNumber={1} width={600} />
              </Document>
            )}
            <iframe
              src={`${
                tempFileType === "pdf"
                  ? `https://docs.google.com/viewer?embedded=true&url`
                  : `https://view.officeapps.live.com/op/embed.aspx?src`
              }=${encodeURIComponent(tempFileLocation)}`}
              width="80%"
              height="800px"
            ></iframe>
          </>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="signatories" className="form-label">
          Signatories
        </label>
        <p className="form-sub-label">
          Please enter the full names and emails addresses of all signatories.
          The signature fields are automatically generated on the document via
          an execution page or auto insertion, so you don’t need to mark out
          boxes.
        </p>
        <div className="signatories-list">
          {fields.map((field, index) => (
            <div key={field.id} className="signatories-item">
              <div className="signatories-item-input">
                <div className="signatories-item-input-inr">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="NAME"
                    {...register(`signatories.${index}.name`)}
                  />
                  {errors.signatories?.[index]?.name && (
                    <div className="text-danger mt-2">
                      {errors.signatories[index].name.message}
                    </div>
                  )}
                </div>
                <div className="signatories-item-input-inr">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="EMAIL"
                    {...register(`signatories.${index}.email`)}
                  />
                  {errors.signatories?.[index]?.email && (
                    <div className="text-danger mt-2">
                      {errors.signatories[index].email.message}
                    </div>
                  )}
                </div>
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  className="signatories-item-action-btn"
                  onClick={() => remove(index)}
                >
                  <i className="icon-minus" />
                </button>
              )}
            </div>
          ))}
          <div className="signatories-item">
            <button
              type="button"
              className="signatories-item-action-btn"
              onClick={() => [append({ name: "", email: "" })]}
            >
              <i className="icon-plus" />
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="" className="form-label">
          Total
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="TOTAL"
          value={`$${fields.length}`}
          readOnly
        />
        {isPaymentSuccess ? (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => reSaveEnvelope()}
          >
            RE-SEND
            <i className="icon-chevron-right" />
          </button>
        ) : (
          <button type="submit" className="btn btn-outline-primary">
            {paymentLoading
              ? "REDIRECTING TO SECURE PAYMENT..."
              : "PAY AND SEND"}{" "}
            <i className="icon-chevron-right" />
          </button>
        )}
        {error && (
          <div className="text-danger mt-3" ref={errorRef}>
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-success mt-3" ref={successRef}>
            {successMessage}
          </div>
        )}
      </div>
    </form>
  );
};

export default SignatoriesForm;
