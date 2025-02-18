import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  href: string;
  label: string;
  titleFooter?: string;
};

export default function BackButton({
  href,
  label,
  titleFooter,
}: BackButtonProps) {
  const shouldShowBackButton = href || label || titleFooter;

  return (
    shouldShowBackButton ? (
      <Button variant={"link"} className="mx-auto" asChild>
        <Link
          href={href}
          className="underline underline-offset-4 hover:text-primary"
        >
          {label}{" "}
          {titleFooter}
        </Link>
      </Button>
    ) : null
  );
}
