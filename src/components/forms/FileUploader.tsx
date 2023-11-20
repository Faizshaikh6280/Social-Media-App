import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (Files: File[]) => void;
  mediaUrl: string;
};

export default function FileUploader({
  fieldChange,
  mediaUrl,
}: FileUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-black-500 rounded-xl cursor-pointer "
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <div className="file-displayer flex-col  flex justify-center items-center w-full p-5 lg:p-8">
          <img
            src={fileUrl}
            alt="image-file"
            width={300}
            height={100}
            className="rounded-xl "
          />
          <p className="text-gray-500 mt-2 text-sm ">
            Click to replace with another
          </p>
        </div>
      ) : (
        <div className="file_uploader-box h-60 flex justify-center items-center flex-col overflow-hidden">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
            className="mb-1"
          />
          <h3 className="text-base text-white">Drag photo here</h3>
          <p className="text-gray-500 text-xs">SVG, JPG, PNG</p>
          <Button className="mt-3 px-2" type="button">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
