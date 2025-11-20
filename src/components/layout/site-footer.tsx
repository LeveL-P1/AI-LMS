import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">Synapse</span>
            <p className="mt-2 text-sm text-gray-600">
              The modern learning management system.
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Synapse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
