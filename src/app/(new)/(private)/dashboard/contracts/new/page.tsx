"use client";

import { ContractUpload } from "@/components/dashboard/ContractUpload";
import { DocumentWorkspace } from "@/components/dashboard/contract/DocumentWorkspace";
import { FieldToolbar } from "@/components/dashboard/contract/FieldToolbar";
import type { Field } from "@/types/dashboard";
import { Suspense, useEffect, useMemo, useState } from "react";
import { v4 as uuid4 } from "uuid";

import { LoaderPinwheel, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { createStripeSession } from "@/old-actions/createStripeSession";
import { convertDocxToPdf } from "@/components/dashboard/contract/converDocxPdf";
import SelectUserModel from "@/components/dashboard/contract/selectUserModel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { ROUTES } from "@/lib/constants";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContractStripeSession } from "@/app/api/stripe-session/createContractStripeSession";
export interface ContractUser {
  name: string;
  id: string;
  email: string;
}
interface SelectUserModelProps {
  type: "signature" | "name" | "initials" | "date" | "";
  open: boolean;
}
const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Contract must be at least 3 characters.",
  }),
  addWallet: z.boolean(),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  tag: z.string().min(3, {
    message: "Tag must be at least 3 characters.",
  }),
  contractExpiry: z.string().nonempty({
    message: "contract expiry is required.",
  }),
  users: z.array(
    z.object({
      name: z.string().min(2, {
        message: "User must be at least 2 characters.",
      }),
      email: z.string().email(),
      id: z.string(),
    }),
  ),
});

export default function ContractEditor() {
  const session = useSession();
  const searchParams = useSearchParams();
  const signers = searchParams.get("signers");
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wallet, setWallet] = useState<number>(0);
  const [walletCheck, setWalletCheck] = useState<boolean>(false);
  const [selectUserModel, setSelectUserModel] = useState<SelectUserModelProps>({
    type: "",
    open: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [docxLoading, setDocxLoading] = useState<boolean>(false);

  const publishableKey = process.env
    .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(publishableKey);

  const file_path = searchParams.get("file_path");
  const paymentStatus = searchParams.get("payment_status");
  const StripeSession = searchParams.get("session");

  const WALLET_ACCESS = useMemo(() => {
    return (
      session?.data?.user?.isTeamMember ||
      session?.data?.user?.role == "company"
    );
  }, [session?.data]);

  //////SUGGESTIONS//////////////////////////////////////////////////

  const [defaultUsers, setDefaultUsers] = useState<ContractUser[]>([
    {
      name: "John Doe",
      email: "john@example.com",
      id: "default-1",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      id: "default-2",
    },
  ]);

  const [nameSuggestions, setNameSuggestions] = useState<ContractUser[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);

  const handleNameInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    form.setValue(`users.${index}.name`, value);

    const filteredSuggestions = defaultUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase()),
    );

    setNameSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setCurrentUserIndex(index);
  };

  const selectSuggestion = (user: ContractUser) => {
    form.setValue(`users.${currentUserIndex}.name`, user.name);
    form.setValue(`users.${currentUserIndex}.email`, user.email);
    setShowSuggestions(false);
    setNameSuggestions(defaultUsers);
  };

  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (paymentStatus && StripeSession) {
      // handleStripePayment(paymentStatus, StripeSession);
      if (paymentStatus == "success") {
        handleStripePayment(paymentStatus, StripeSession);
      } else {
        toast({
          title: "Error",
          description: "cannot complete the payment",
          variant: "destructive",
        });
      }
    }
  }, []);
  async function handleStripePayment(
    paymentStatus: string,
    StripeSession: string,
  ) {
    try {
      setLoading(true);
      const res = await axiosInstance.put("/api/stripe-session", {
        paymentStatus,
        StripeSession,
      });

      console.log("Response:", res.data, typeof res.data);

      if (paymentStatus == "success")
        toast({
          title: "contract added",
          description: "contract added successfully",
          variant: "default",
        });
      router.push(ROUTES.contracts);
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error",
        description: "cannot complete the payment",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (file_path) {
      axios
        .get(file_path, { responseType: "blob" })
        .then((response) => {
          const blob = response.data;
          const fileName = file_path.split("/").pop() || "file.pdf";
          const file = new File([blob], fileName, { type: blob.type });
          if (file.type !== "application/pdf") {
            convertDocxToPdf(file).then((converted) => {
              setSelectedFile(converted);
            });
          } else setSelectedFile(file);
        })
        .catch((e) => console.log(e, "Error"));
    }
  }, [file_path]);
  useEffect(() => {
    checkWallet();
    getTeam();
  }, [session?.data?.user]);

  async function getTeam() {
    if (
      session?.data?.user?.isTeamMember ||
      session?.data?.user.role == "company"
    ) {
      let id = session.data?.user?.id;
      if (session.data?.user?.isTeamMember) {
        const adminData = await axios.get(
          "/api/team/get-admin?id=" + session.data?.user?.id,
        );
        id = adminData.data?.admin_id;
      }
      const response = await axios.get(`/api/team?id=${id}`);
      if (response?.data?.length) {
        const d = response.data
          ?.map((user: any) => ({
            name: user.userName,
            email: user.userEmail,
            id: user?.id,
          }))
          .filter((user: any) => user.name && user.email);
        setDefaultUsers(d);
        setNameSuggestions(d);
      }
    }
  }
  async function checkWallet() {
    if (
      session?.data?.user?.isTeamMember ||
      session?.data?.user.role == "company"
    ) {
      let id = session.data?.user?.id;
      if (session.data?.user?.isTeamMember) {
        const adminData = await axios.get(
          "/api/team/get-admin?id=" + session.data?.user?.id,
        );
        id = adminData.data?.admin_id;
      }
      const response = await axios.get(`/api/wallet?id=${id}`);
      setWallet(response.data.wallet);
    }
  }
  const addField = (type: Field["type"], user: string) => {
    // if (
    //   fields.length &&
    //   fields.find((field) => field.type == type && field.user == user)
    // ) {
    //   toast({
    //     title: "Field already added",
    //     description: "You have already added this field to the document",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const newField: Field = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: { x: 0, y: 0 },
      viewPage: getCurrentPage(),
      user: user,
    };
    if (type === "signature") {
      // append({ id: uuid4(), name: "", email: "" })
    }

    setFields((prev) => {
      return [...prev, newField];
    });
    console.log("Filed Added", newField);
  };

  const updateFieldPosition = (
    id: string,
    position: { x: number; y: number },
  ) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, position } : field)),
    );
  };

  const updateFieldValue = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field)),
    );
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
    // remove(fields - 1);
  };

  const getCurrentPage = () => {
    return currentPage;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      addWallet: false,
      tag: "",
      contractExpiry: "",
      users: Array.from({ length: signers ? parseInt(signers) : 1 }, () => ({
        id: uuid4(),
        name: "",
        email: "",
      })),
    },
  });

  const {
    fields: Userdata,
    append,
    remove,
  } = useFieldArray({
    name: "users",
    control: form.control,
  });

  const users = form.watch("users");

  const totalAmount = useMemo(
    () =>
      walletCheck
        ? users.length > wallet
          ? users.length - wallet
          : 0
        : users.length,
    [walletCheck, users?.length, wallet],
  );

  const RemaingWallet = useMemo(
    () =>
      walletCheck
        ? users.length < wallet
          ? wallet - users.length
          : 0
        : wallet,
    [walletCheck, users?.length, wallet],
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!selectedFile) {
      toast({
        title: "Please upload a file",
        description: "Please upload a file before submitting",
        variant: "destructive",
      });
      return;
    }
    const userPositions: { [key: string]: any[] } = {};
    fields.forEach((field: any) => {
      if (!userPositions[field.user]) {
        userPositions[field.user] = [field];
      } else userPositions[field.user]?.push(field);
    });
    const keys = Object.keys(userPositions);

    for (const u of users) {
      if (u?.id && !keys.includes(u.id)) {
        toast({
          title: "Required atleast one signature field",
          description: "Please add atlest one  ignature field for all users",
          variant: "destructive",
        });
        return;
      }
    }
    let id = session.data?.user?.id;
    if (session.data?.user?.isTeamMember) {
      const adminData = await axios.get(
        "/api/team/get-admin?id=" + session.data?.user?.id,
      );
      id = adminData.data?.admin_id;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("users", JSON.stringify(users));
    formData.append("userList", JSON.stringify(users));
    formData.append("signatureFields", JSON.stringify(fields));
    formData.append("userId", id as string);
    formData.append("contractExpiry", data.contractExpiry);
    formData.append("tags", data.tag);
    setLoading(true);
    try {
      if (totalAmount) {
        const stripe: any = await stripePromise;
        const checkoutSession = await createContractStripeSession({
          name: "Upload Document Payment",
          quantity: totalAmount,
        });
        if (!checkoutSession.isSuccess) {
          toast({
            title: "error",
            description: "There is some error in payment gateway",
            variant: "destructive",
          });
          return;
        }

        formData.append(
          "walletAmount",
          (walletCheck ? wallet - RemaingWallet : 0) as any,
        );
        formData.append(
          "sessionId",
          (checkoutSession?.data?.id || "") as string,
        );
        const res = await axiosInstance.post("api/stripe-session", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);

        const redirectToStripe = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data?.id,
        });
        setLoading(false);
        return;
      }
      if (walletCheck) {
        let id = session.data?.user?.id;
        if (session.data?.user?.isTeamMember) {
          const adminData = await axios.get(
            "/api/team/get-admin?id=" + session.data?.user?.id,
          );
          id = adminData.data?.admin_id;
        }
        const deduct = await axiosInstance.put("/api/wallet/deduct", {
          id: id,
          amount: wallet - RemaingWallet,
        });
      }
      const result: any = await axiosInstance.post(
        "/api/file-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast({
        variant: result.status === "success" ? "default" : "destructive",
        title: result.message ?? "Working on it...",
      });
      router.push(ROUTES.contracts);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  async function handleSelectFile(file: File) {
    setDocxLoading(true);
    try {
      if (file.type !== "application/pdf") {
        const conveted = await convertDocxToPdf(file);

        setSelectedFile(conveted);
      } else setSelectedFile(file);
    } catch (e) {
      console.log(e);
    }

    setDocxLoading(false);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Contract Editor
          </h1>
          <p className="text-gray-600">
            Upload your document and add signature fields for your recipients
          </p>
        </div>
        {docxLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <LoaderPinwheel className="animate-spin" />
          </div>
        )}
        <div className="z-20">
          <SelectUserModel
            open={selectUserModel.open}
            onClose={() => {
              setSelectUserModel({ type: "signature", open: false });
            }}
            onConfirm={(value: string) => {
              addField(selectUserModel.type, value);
              setSelectUserModel({ type: "signature", open: false });
            }}
            fields={fields}
            user={users.length ? users : [{ name: "", email: "", id: "" }]}
            type={selectUserModel.type}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Document Title"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Insert the title of this document so the receiving party can
                    easily identify what they are signing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Message" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please insert a short email message for the other signing
                    parties to easily understand what they are signing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Tag" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a tag to help signing parties easily identify the
                    document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Expiry</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Select a date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the date by which this contract should be expiry.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mx-auto w-full space-y-2">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="mx-auto flex h-full w-1/2 items-center justify-evenly align-middle"
                >
                  <FormField
                    control={form.control}
                    name={`users.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Signee Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter Name"
                              {...field}
                              onChange={(e) => handleNameInputChange(index, e)}
                              onFocus={() => {
                                console.log("TEST", index, nameSuggestions);
                                setCurrentUserIndex(index);
                                setShowSuggestions(true);
                              }}
                              onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 200)
                              }
                            />
                            {showSuggestions &&
                              nameSuggestions?.length > 0 &&
                              index === currentUserIndex && (
                                <div className="z-14 absolute mt-1 w-full rounded-md border bg-white shadow-lg">
                                  {nameSuggestions.map(
                                    (user, suggestionIndex) => (
                                      <div
                                        key={user.id}
                                        className={`cursor-pointer overflow-hidden text-ellipsis p-2 hover:bg-gray-100 ${
                                          suggestionIndex ===
                                          activeSuggestionIndex
                                            ? "bg-gray-100"
                                            : ""
                                        }`}
                                        onMouseDown={() =>
                                          selectSuggestion(user)
                                        }
                                      >
                                        {user.name} ({user.email})
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`users.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signee Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {users.length > 1 && (
                    <Button
                      disabled={loading}
                      variant="destructive"
                      type="button"
                      className="mt-5"
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}
              <div className="w-full text-center">
                <Button
                  disabled={loading}
                  variant="default"
                  className="mt-3 text-center"
                  type="button"
                  onClick={() => {
                    !users?.length &&
                      append({ id: uuid4(), name: "", email: "" });
                    const lastUser = form.getValues(
                      `users.${users.length - 1}`,
                    );
                    if (!lastUser?.name || !lastUser?.email) {
                      toast({
                        title: "Incomplete User Information",
                        description:
                          "Please fill in the name and email of the last user before adding another.",
                        variant: "destructive",
                      });

                      return;
                    }

                    append({ id: uuid4(), name: "", email: "" });
                    setSelectUserModel({ type: "", open: false });
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {!selectedFile ? (
              <ContractUpload onFileSelect={handleSelectFile} />
            ) : (
              <div className="space-y-6">
                <FieldToolbar
                  onAddField={(type) =>
                    setSelectUserModel({ type: type, open: true })
                  }
                  setSelectedFile={setSelectedFile}
                />

                <div className="flex justify-center">
                  <DocumentWorkspace
                    file={selectedFile}
                    fields={fields}
                    onFieldPositionChange={updateFieldPosition}
                    onFieldValueChange={updateFieldValue}
                    onFieldDelete={deleteField}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            )}

            <div className="mx-auto w-full">
              <div className="ml-4 mt-2 border-spacing-1 items-start justify-start gap-8 border-gray-700">
                {WALLET_ACCESS && (
                  <>
                    <p className="my-4 text-gray-800">
                      Total Wallet Amout:
                      <span className="ml-2 text-gray-600">{`$ ${RemaingWallet}`}</span>
                    </p>
                    <input
                      type="checkbox"
                      id="user-emails"
                      checked={walletCheck}
                      onChange={(e) => setWalletCheck(e.target.checked)}
                    />
                    <label className="ml-2 text-gray-800" htmlFor="user-emails">
                      Use wallet amount
                    </label>
                  </>
                )}
                <p className="my-4 text-gray-800">
                  Total Amount:
                  <span className="ml-2 text-gray-600">{`$ ${totalAmount}`}</span>
                </p>
              </div>

              {/* <Button className="" variant={"outline"}>
                Total Amount: $ {users.length}
              </Button> */}

              <Button
                disabled={loading}
                className="h-full w-full py-4"
                type="submit"
              >
                {loading ? (
                  <LoaderPinwheel className="animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Send Document
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Suspense>
  );
}
