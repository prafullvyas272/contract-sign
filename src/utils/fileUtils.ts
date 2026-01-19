// import type { Field } from "../types/dashboard";

// interface SavedContract {
//   documentFile: File;
//   fields: Field[];
//   timestamp: number;
// }

// interface IBase64File {
//   name: string;
//   type: string;
//   base64: string;
// }

// export async function generateBase64File(file: File): Promise<IBase64File> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const base64 = reader.result as string;
//       resolve({
//         name: file.name,
//         type: file.type,
//         base64,
//       });
//     };
//     reader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }

// export async function saveContractToLocalStorage(
//   contract: SavedContract,
// ): Promise<string> {
//   const contractId = `contract-${Date.now()}`;

//   // Convert File to base64
//   const fileBuffer = await contract.documentFile.arrayBuffer();
//   const base64File = btoa(
//     new Uint8Array(fileBuffer).reduce(
//       (data, byte) => data + String.fromCharCode(byte),
//       "",
//     ),
//   );

//   const contractData = {
//     ...contract,
//     documentFile: {
//       name: contract.documentFile.name,
//       type: contract.documentFile.type,
//       base64: base64File,
//     },
//   };

//   localStorage.setItem(contractId, JSON.stringify(contractData));
//   return contractId;
// }

// export async function saveContractToS3Storage(documentFile: File) {
//   const base64File = await generateBase64File(documentFile);
// }

// export function downloadContract(contractId: string, fileName: string) {
//   const contractData = localStorage.getItem(contractId);
//   if (!contractData) return null;

//   const { documentFile, fields } = JSON.parse(contractData);

//   // Create a combined data object
//   const downloadData = {
//     document: {
//       name: documentFile.name,
//       type: documentFile.type,
//     },
//     fields: fields,
//   };

//   // Create JSON file for fields data
//   const fieldsBlob = new Blob([JSON.stringify(downloadData, null, 2)], {
//     type: "application/json",
//   });

//   // Create download link
//   const downloadLink = document.createElement("a");
//   downloadLink.href = URL.createObjectURL(fieldsBlob);
//   downloadLink.download = `${fileName.replace(/\.[^/.]+$/, "")}_with_fields.json`;

//   // Trigger download
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);

//   // Also download the original document
//   const docBlob = base64ToBlob(documentFile.base64, documentFile.type);
//   console.log("docBlob", docBlob);
//   const docLink = document.createElement("a");
//   docLink.href = URL.createObjectURL(docBlob);
//   docLink.download = documentFile.name;

//   document.body.appendChild(docLink);
//   docLink.click();
//   document.body.removeChild(docLink);
// }

// function base64ToBlob(base64: string, type: string): Blob {
//   const byteCharacters = atob(base64);
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//     const slice = byteCharacters.slice(offset, offset + 512);
//     const byteNumbers = new Array(slice.length);

//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     byteArrays.push(new Uint8Array(byteNumbers));
//   }

//   return new Blob(byteArrays, { type });
// }
