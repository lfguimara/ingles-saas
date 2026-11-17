import Link from "next/link";

export function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 font-head text-xl font-extrabold ${light ? "text-white" : "text-navy"}`}>
      <i className="grid h-8 w-8 place-items-center rounded-xl bg-blue not-italic text-white">S</i>
      SpeakUp
    </Link>
  );
}
