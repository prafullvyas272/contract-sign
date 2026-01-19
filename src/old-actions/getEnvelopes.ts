"use server";

export const getEnvelopes = async () => {
  try {
    const response = await fetch(
      `${process.env.SIGNATURE_API_URL}/envelopes?status=completed`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.SIGNATURE_API_KEY as string,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      },
    );

    const responseData = await response.json();
    if (!response.ok) {
      return {
        isSuccess: false,
        date: responseData,
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
