import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft, CheckCircle, Shield, Zap, RefreshCcw } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Por defecto registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      window.gtag?.("event", "registro_intento", {});
    } else {
      window.gtag?.("event", "login_intento", {});
    }

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (!isSignUp) {
      window.gtag?.("event", "login_exitoso", {});
      navigate("/dashboard");
    } else {
      window.gtag?.("event", "registro_exitoso", {});
      await supabase.functions.invoke("send-welcome-email", {
        body: { email },
      });
      // En lugar de pedir confirmación de email, llevar al dashboard directamente
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">
            {isSignUp ? "Crea tu boda gratis" : "Bienvenido de nuevo"}
          </h1>
          <p className="text-muted-foreground font-light text-sm">
            {isSignUp
              ? "Regístrate gratis y explora todas las funcionalidades. Solo pagas cuando quieras publicar."
              : "Accede a tu panel de boda"}
          </p>
        </div>

        {/* Beneficios — solo en registro */}
        {isSignUp && (
          <div className="bg-secondary rounded-xl p-4 mb-6 space-y-2">
            {[
              "Acceso gratis a todas las demos",
              "Crea tu boda y personalízala sin pagar",
              "Solo pagas cuando quieras publicarla — desde 30€",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p className={`text-sm p-3 rounded-lg ${error.includes("creada") || error.includes("exitoso") ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-base"
          >
            {loading
              ? "Cargando..."
              : isSignUp
              ? "Crear cuenta gratis →"
              : "Iniciar sesión →"}
          </button>
        </form>

        {/* Garantías */}
        {isSignUp && (
          <div className="flex flex-wrap justify-center gap-4 mt-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Pago seguro</span>
            <span className="flex items-center gap-1"><RefreshCcw className="w-3.5 h-3.5" /> 30 días de garantía</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Lista en minutos</span>
          </div>
        )}

        <p className="text-center mt-5 text-muted-foreground text-sm">
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            {isSignUp ? "Iniciar sesión" : "Crear una gratis"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
