import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (!isSignUp) {
      navigate("/dashboard");
    } else {
      // Enviar email de bienvenida
      await supabase.functions.invoke("send-welcome-email", {
        body: { email },
      });
      setError("¡Cuenta creada! Revisa tu email para confirmar.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
        <div className="text-center mb-10">
          <Heart className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl text-foreground mb-2">
            {isSignUp ? "Crear cuenta" : "Bienvenidos"}
          </h1>
          <p className="text-muted-foreground font-light">
            {isSignUp
              ? "Crea tu cuenta para organizar vuestra boda"
              : "Accede a tu panel de boda"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <p className={`text-sm p-3 rounded-lg ${error.includes("creada") ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? "Cargando..."
              : isSignUp
              ? "Crear cuenta"
              : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            {isSignUp ? "Iniciar sesión" : "Crear una"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
export default Auth;
