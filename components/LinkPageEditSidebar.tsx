"use client";

import { Button } from "./ui/button";
import Dropzone from "./ui/dropzone";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import useClickOutside from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/supabase-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";
import { Sidebar, Trash } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";

const colors = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

type Params = {
  theme?: Tables<"themes">;
  setTheme: React.Dispatch<React.SetStateAction<Tables<"themes">>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const LinkPageEditSidebar = (params: Params) => {
  const { theme, setTheme, files, setFiles } = params;

  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);
  const popover = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsColorPickerOpen(false), []);

  useClickOutside(popover, close);

  console.log({ theme });

  return (
    <aside className="h-full w-[340px] bg-muted mx-4 overflow-y-auto">
      <div className="p-4">
        <SidebarItem title="Company Name">
          <Input
            value={theme?.company_name || ""}
            onChange={(e) => {
              setTheme((prev) => ({
                ...(prev || ({} as Tables<"themes">)),
                company_name: e.target.value,
              }));
            }}
          />
        </SidebarItem>
        <SidebarItem title="Description">
          <Textarea
            value={theme?.description || ""}
            onChange={(e) => {
              setTheme((prev) => ({
                ...(prev || ({} as Tables<"themes">)),
                description: e.target.value,
              }));
            }}
          />
        </SidebarItem>
        <SidebarItem title="Color">
          <div className="picker flex gap-2 items-center mt-2">
            <div
              className="swatch flex shrink-0"
              style={{ backgroundColor: theme?.color || "#000000" }}
              onClick={() => setIsColorPickerOpen(true)}
            />
            <Input
              value={theme?.color || "#000000"}
              onChange={(e) => {
                setTheme((prev) => ({
                  ...(prev || ({} as Tables<"themes">)),
                  color: e.target.value,
                }));
              }}
            />

            {isColorPickerOpen && (
              <div className="popover" ref={popover}>
                <HexColorPicker
                  className="z-50"
                  color={theme?.color || "#000000"}
                  onChange={(newColor) =>
                    setTheme((prev) => ({
                      ...(prev || ({} as Tables<"themes">)),
                      color: newColor,
                    }))
                  }
                />
              </div>
            )}
          </div>
        </SidebarItem>
        <SidebarItem title="Logo">
          <ImageUpload
            files={files}
            setFiles={setFiles}
            setTheme={setTheme}
            logo={theme?.logo || undefined}
          />
        </SidebarItem>
      </div>
    </aside>
  );
};

type SidebarItemProps = {
  children: React.ReactNode;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

const SidebarItem = ({
  children,
  title,
  className,
  ...props
}: SidebarItemProps) => {
  return (
    <div className={cn("mt-8", className)} {...props}>
      <p className="mb-2">{title}</p>
      {children}
    </div>
  );
};

type ImageUploadParams = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  logo?: string;
  setTheme: React.Dispatch<React.SetStateAction<Tables<"themes">>>;
};

const ImageUpload = ({
  files,
  setFiles,
  logo,
  setTheme,
}: ImageUploadParams) => {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(logo);

  useEffect(() => {
    if (logo) {
      setLogoUrl(logo);
    }
  }, [logo]);

  if (logoUrl) {
    return (
      <div className="flex items-center relative w-full">
        <img src={logoUrl} alt="logo" className="rounded-md object-cover" />
        <Button
          className="p-0 w-8 h-8 absolute top-2 right-2"
          onClick={() => {
            setFiles([]);
            setLogoUrl(undefined);
            setTheme((prev) => ({
              ...(prev as Tables<"themes">),
              logo: null,
            }));
          }}
        >
          <Trash size={16} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-8 w-full mt-2">
        {!!files.length ? (
          <div className="flex-1">
            <div className="">
              <div className="flex items-center relative w-full">
                <img
                  src={URL.createObjectURL(files[0]!)}
                  alt="logo"
                  className="rounded-md object-cover"
                />
                <Button
                  className="p-0 w-8 h-8 absolute top-2 right-2"
                  onClick={() => {
                    setFiles([]);
                    setLogoUrl(undefined);
                    setTheme((prev) => ({
                      ...(prev || ({} as Tables<"themes">)),
                      logo: null,
                    }));
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Dropzone />
        )}
      </div>
    </>
  );
};

export default LinkPageEditSidebar;
