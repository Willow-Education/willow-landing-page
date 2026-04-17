import { Wordmark } from "./wordmark";

export function TntpFooter() {
  return (
    <footer className="bg-[#FAFAF7] border-t border-[#E5E5E0]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <Wordmark className="text-xl md:text-2xl" />
            <p className="text-sm text-[#525252]">
              Co-led by TNTP · Willow Education · Gates Foundation
            </p>
          </div>
          <p className="text-sm text-[#737373]">
            &copy; {new Date().getFullYear()} Opportunity Advising
          </p>
        </div>
      </div>
    </footer>
  );
}
