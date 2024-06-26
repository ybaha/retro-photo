"use client";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import {
  deleteImage,
  markImagesAsExpired,
} from "@/app/[locale]/(dashboard)/dashboard/actions";
import { Enums, Tables } from "@/types/supabase-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Download, ExternalLink, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactCompareImage from "react-compare-image";

const statusMap = {
  pending_from_replicate: "Processing",
  error: "Error",
  completed: "Completed",
  adding_watermark: "Almost done",
  deleted: "Deleted",
} as const;

const getDate = (date: string) => {
  const dateString = new Date(date).toLocaleDateString();
  const time = new Date(date).toLocaleTimeString();
  return `${dateString} ${time}`;
};

const checkExpired = (params: {
  id: string;
  date: string;
  status: Enums<"image_status">;
}) => {
  const { id, date, status } = params;
  // check if 10 min has passed since creation and still status is pending_from_replicate
  const currentDate = new Date();
  const createdDate = new Date(date);
  const diff = currentDate.getTime() - createdDate.getTime();

  if (
    diff > 10 * 60 * 1000 &&
    (status === "pending_from_replicate" || status === "adding_watermark")
  ) {
    markImagesAsExpired(id);
  }
};

type ImageListProps = {
  imagesFromServer: Tables<"images">[] | null;
  profile: Tables<"profiles"> | null;
};

export function ImageList(params: ImageListProps) {
  const { imagesFromServer, profile } = params;

  const [images, setImages] = useState<Tables<"images">[] | null>(
    imagesFromServer
  );

  const pendingImages = images?.some(
    (image) =>
      image.status === "pending_from_replicate" ||
      image.status === "adding_watermark"
  );

  useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      return axios.get("/api/images").then((res) => {
        setImages(res.data);
        return res.data;
      }) as Promise<Tables<"images">[]>;
    },
    enabled: pendingImages,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (imagesFromServer) {
      setImages(imagesFromServer);
    }
  }, [imagesFromServer]);

  return (
    <div className="">
      {images?.map((image) => {
        checkExpired({
          id: image.id,
          date: image.created_at,
          status: image.status,
        });

        const status = statusMap[image.status];
        const isLoading =
          image.status !== "completed" &&
          image.status !== "error" &&
          image.status !== "deleted";

        const isErrored = image.status === "error";

        const isCompleted = image.status === "completed";

        return (
          <div key={image.id} className="flex gap-4 mb-6 border p-2 rounded-md">
            <div>
              {isLoading && (
                <div className="w-32 h-32 min-w-32 flex justify-center items-center rounded-md border border-foreground relative">
                  {image.unprocessed_url && (
                    <>
                      <img
                        src={image.unprocessed_url}
                        alt={image.description || "image"}
                        className="w-32 h-32 min-w-32 rounded-md object-cover"
                      />
                      <div className="w-32 h-32 min-w-32 absolute rounded-md z-10 bg-foreground opacity-40" />
                    </>
                  )}
                  <Loader className="animate-spin absolute z-20 text-background" />
                </div>
              )}
              {isErrored && (
                <div className="w-32 h-32 min-w-32 flex justify-center items-center rounded-md border border-error">
                  <img
                    src={image.unprocessed_url || ""}
                    alt={image.description || "image"}
                    className="w-32 h-32 min-w-32 rounded-md object-cover"
                  />
                </div>
              )}
              {isCompleted && (
                <img
                  src={image.processed_url || ""}
                  alt={image.description || "image"}
                  className="w-32 h-32 min-w-32 rounded-md object-cover"
                />
              )}
            </div>
            <div className="w-full flex flex-col justify-between">
              <div>
                <p className="font-semibold">{status}</p>
                <p>{image.description?.slice(0, 20)}...</p>
                <p className="text-muted-foreground text-sm">
                  {getDate(image.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ImageSheet image={image} user={profile} />
                <Button
                  variant="outline"
                  className="px-2"
                  onClick={() => {
                    window.open(image.processed_url || "");
                  }}
                >
                  <Download />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ImageSheet = ({
  image,
  user,
}: {
  image: Tables<"images">;
  user: Tables<"profiles"> | null;
}) => {
  const status = statusMap[image.status];
  const isLoading =
    image.status !== "completed" &&
    image.status !== "error" &&
    image.status !== "deleted";

  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Details</Button>
      </SheetTrigger>
      <SheetContent className="w-[86%] sm:w-2/5 overflow-y-scroll h-screen">
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="w-full h-[calc(100vh/2)] object-cover border border-border rounded-md flex items-center justify-center relative">
              <Loader className="animate-spin absolute inset-0 left-0 right-0 m-auto z-10" />
              <img
                src={image.unprocessed_url || ""}
                alt={"image"}
                className="w-full h-full object-cover rounded-md"
              />
              <div
                id="overlay"
                className="absolute inset-0 left-0 right-0 m-auto bg-foreground/25 rounded-md backdrop-blur-lg"
              />
            </div>
          ) : (
            <ReactCompareImage
              leftImage={image.unprocessed_url || ""}
              rightImage={image.processed_url || ""}
              sliderLineColor="#fff"
              sliderLineWidth={2}
              sliderPositionPercentage={0.5}
              handleSize={40}
            />
          )}
        </div>
        <SheetHeader className="text-left">
          <SheetTitle>Image</SheetTitle>
          <SheetDescription className="flex flex-col gap-1">
            <span>Status: {status}</span>
            {image.description && (
              <span className="font-semibold">
                Description: {image.description}
              </span>
            )}
            <span className="text-xs">
              Created At: {getDate(image.created_at)}
            </span>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="w-full">
          <SheetClose className="mt-8 flex flex-col gap-4 w-full">
            {image.with_watermark && !user?.is_paid_user && (
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  router.push(`/dashboard/billing`);
                }}
              >
                ✨ Download without watermark ✨
              </Button>
            )}
            <Button
              variant={
                image.with_watermark && !user?.is_paid_user
                  ? "outline"
                  : "default"
              }
              className="w-full"
              onClick={() => {
                window.open(image.processed_url || "");
              }}
            >
              Download
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={async (e) => {
                e.preventDefault();
                await deleteImage(image.id);
              }}
            >
              Delete
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
