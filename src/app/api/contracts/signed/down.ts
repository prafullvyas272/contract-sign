    export const downloadFile = async (url: string): Promise<File> => {
      const response = await fetch(url);
      const blob = await response.blob();
      let contentType = response.headers.get("content-type");

      if (contentType !== "application/pdf") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      

      // const extension = contentType.split("/")[1];
      return new File(
        [blob],
        `document.${contentType == "application/pdf" ? "pdf" : "docx"}`,
        { type: contentType },
      );
    };