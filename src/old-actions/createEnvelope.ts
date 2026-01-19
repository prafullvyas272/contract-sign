"use server";

export const createEnvelope = async (payload: any) => {
  try {
    const response = await fetch(`${process.env.SIGNATURE_API_URL}/envelopes`, {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.SIGNATURE_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: payload,
      next: { revalidate: 0 },
    });

    const responseData = await response.json();
    if (!response.ok) {
      return {
        isSuccess: false,
        data: responseData,
      };
    }

    return {
      isSuccess: true,
      data: responseData,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
    };
  }
};
