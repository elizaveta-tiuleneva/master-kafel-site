import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext.js";
import { btn, field, label } from "../ui.js";

function errorMessage(error) {
  if (error?.code === "invalid_credentials" || /invalid login/i.test(error?.message || "")) {
    return "Неверный email или пароль.";
  }
  if (/fetch|network/i.test(error?.message || "")) {
    return "Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.";
  }
  return "Не удалось войти. Попробуйте ещё раз.";
}

export default function LoginPage() {
  const { status, signIn, signOut } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (status === "admin") {
    return <Navigate to={location.state?.from || "/admin"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Введите email и пароль.");
      return;
    }
    setSending(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSending(false);
    if (signInError) setError(errorMessage(signInError));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10 text-navy">
      <div className="w-full max-w-[400px] rounded-lg border border-[#dbe4ec] bg-white p-6 sm:p-8">
        <p className="text-[14px] font-semibold text-muted">MASTER КАФЕЛЬ</p>
        <h1 className="mt-1 text-[26px] font-bold">Вход в админ-панель</h1>

        {status === "notAdmin" ? (
          <div role="alert" className="mt-5 rounded border border-[#f1b8b0] bg-[#fff7f6] p-4 text-[15px] text-[#b42318]">
            У этой учётной записи нет прав администратора.
            <button type="button" onClick={signOut} className="mt-2 block font-semibold underline">
              Выйти и войти другим пользователем
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className={label}>Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className={label}>Пароль</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={field}
              />
            </div>
            {error ? (
              <p role="alert" className="text-[15px] font-medium text-[#b42318]">{error}</p>
            ) : null}
            <button type="submit" disabled={sending || status === "checking"} className={`${btn.primary} w-full`}>
              {sending || status === "checking" ? "Вход…" : "Войти"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
