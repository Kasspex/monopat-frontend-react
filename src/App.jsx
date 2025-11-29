import React, { useState, useEffect } from 'react';
import { User, MapPin, Battery, LogOut, Bike, ArrowRight, Lock, Mail, CreditCard } from 'lucide-react';

// --- MOCK DATA (Simulación de Base de Datos) ---
const INITIAL_SCOOTERS = [
  { id: 1, code: 'MP-001', battery: 85, status: 'disponible', location: 'Parque Central', lat: 4.6, lng: -74.0 },
  { id: 2, code: 'MP-002', battery: 40, status: 'disponible', location: 'Zona T', lat: 4.61, lng: -74.01 },
  { id: 3, code: 'MP-003', battery: 15, status: 'descargado', location: 'Universidad', lat: 4.62, lng: -74.02 },
  { id: 4, code: 'MP-004', battery: 90, status: 'reservado', location: 'Estadio', lat: 4.63, lng: -74.03 },
];

/**
 * Componente: Navbar
 * Barra de navegación superior responsive.
 */
const Navbar = ({ user, onLogout, onChangeView }) => (
  <nav className="bg-slate-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => onChangeView(user ? 'dashboard' : 'login')}
      >
        <div className="bg-blue-500 p-2 rounded-full">
          <Bike size={24} />
        </div>
        <span className="text-xl font-bold tracking-wider">MonoPat</span>
      </div>
      
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-gray-300">Hola, {user.name}</span>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm">Salir</span>
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <button onClick={() => onChangeView('login')} className="hover:text-blue-400 font-medium">Ingresar</button>
          <button onClick={() => onChangeView('register')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition-colors">Registrarse</button>
        </div>
      )}
    </div>
  </nav>
);

/**
 * Componente: ScooterCard
 * Tarjeta individual para mostrar la info de un monopatín.
 */
const ScooterCard = ({ scooter, onReserve }) => {
  // Determinar color del estado y batería
  const getBatteryColor = (level) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const isAvailable = scooter.status === 'disponible';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100">
      <div className="h-32 bg-slate-100 flex items-center justify-center relative">
        <Bike size={48} className="text-slate-400" />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold uppercase ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
          {scooter.status}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800">{scooter.code}</h3>
          <div className={`flex items-center ${getBatteryColor(scooter.battery)}`}>
            <Battery size={16} className="mr-1" />
            <span className="text-sm font-bold">{scooter.battery}%</span>
          </div>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          <span>{scooter.location}</span>
        </div>

        <button
          onClick={() => onReserve(scooter)}
          disabled={!isAvailable}
          className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
            isAvailable 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{isAvailable ? 'Reservar Ahora' : 'No Disponible'}</span>
          {isAvailable && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};

/**
 * Vista: Dashboard
 * Pantalla principal donde se listan los monopatines.
 */
const Dashboard = ({ user, scooters, onReserve }) => {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Monopatines Cercanos</h1>
        <p className="text-slate-500">Encuentra y reserva tu vehículo para comenzar el viaje.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {scooters.map(scooter => (
          <ScooterCard key={scooter.id} scooter={scooter} onReserve={onReserve} />
        ))}
      </div>
    </div>
  );
};

/**
 * Vista: Login
 * Formulario de inicio de sesión.
 */
const LoginView = ({ onLogin, onChangeView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Bienvenido de nuevo</h2>
          <p className="text-slate-500 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-600/30">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes una cuenta? {' '}
          <button onClick={() => onChangeView('register')} className="text-blue-600 font-bold hover:underline">
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Vista: Registro
 * Formulario de registro de usuario.
 */
const RegisterView = ({ onRegister, onChangeView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Crear Cuenta</h2>
          <p className="text-slate-500 text-sm">Únete a la comunidad MonoPat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-600/30">
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? {' '}
          <button onClick={() => onChangeView('login')} className="text-blue-600 font-bold hover:underline">
            Ingresa aquí
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente Principal: App
 * Maneja el estado global y la navegación.
 */
const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const [scooters, setScooters] = useState(INITIAL_SCOOTERS);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }

  // Función para mostrar alertas temporales
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogin = (email, password) => {
    // Simulación de autenticación (CU-02)
    if (email && password) {
      setUser({ name: 'Andrés Homez', email });
      setView('dashboard');
      showAlert('success', '¡Bienvenido de nuevo!');
    } else {
      showAlert('error', 'Credenciales inválidas');
    }
  };

  const handleRegister = (data) => {
    // Simulación de registro (CU-01)
    if (data.name && data.email) {
      setUser({ name: data.name, email: data.email });
      setView('dashboard');
      showAlert('success', 'Cuenta creada exitosamente');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    showAlert('success', 'Sesión cerrada');
  };

  const handleReserve = (scooter) => {
    // Simulación de reserva (CU-04)
    if (!user) {
      showAlert('error', 'Debes iniciar sesión para reservar');
      setView('login');
      return;
    }

    const updatedScooters = scooters.map(s => 
      s.id === scooter.id ? { ...s, status: 'reservado' } : s
    );
    setScooters(updatedScooters);
    showAlert('success', `Reserva confirmada para el monopatín ${scooter.code}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar Global */}
      <Navbar user={user} onLogout={handleLogout} onChangeView={setView} />

      {/* Alerta Flotante */}
      {alert && (
        <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg text-white animate-bounce ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      {/* Ruteo Simple */}
      <main>
        {view === 'login' && <LoginView onLogin={handleLogin} onChangeView={setView} />}
        {view === 'register' && <RegisterView onRegister={handleRegister} onChangeView={setView} />}
        {view === 'dashboard' && <Dashboard user={user} scooters={scooters} onReserve={handleReserve} />}
      </main>
    </div>
  );
};

export default App;