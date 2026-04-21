import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";

interface Props {
  bankAccount: string;
  message: string;
}

const WeddingGift = ({ bankAccount, message }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!bankAccount && !message) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankAccount.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6">
          <Gift className="w-7 h-7 text-sand-accent" />
        </div>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Lista de bodas</h2>
        {message && (
          <p className="text-muted-foreground font-light mb-8 max-w-lg mx-auto leading-relaxed">
            {message}
          </p>
        )}
        {bankAccount && (
          <>
            <div className="bg-card border border-border rounded-xl p-5 inline-flex items-center gap-3">
              <span className="text-foreground font-mono text-sm md:text-base tracking-wide">
                {bankAccount}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-muted-foreground mt-3">¡Copiado!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeddingGift;
