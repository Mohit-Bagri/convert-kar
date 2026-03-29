export function BrandingBanner() {
  return (
    <div className="border-t mt-8 pt-6 pb-2 text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Made in 🇮🇳 with ❤️ by{" "}
        <a
          href="https://mohitbagri-portfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline"
        >
          MOHIT BAGRI
        </a>
      </p>
      <p className="text-sm text-muted-foreground">
        ⭐{" "}
        <a
          href="https://github.com/Mohit-Bagri/convert-kar"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          Star on GitHub
        </a>
        {" "}if you found this useful!
      </p>
    </div>
  );
}
