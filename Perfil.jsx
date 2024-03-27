/*import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="perfil-usuario">
      {currentUser ? (
        <>
          <h2>Perfil de Usuario 🔰</h2>
          <div>
            <p>Nombre: {currentUser.nombre || 'No especificado'}</p>
            <p>Apellido: {currentUser.apellido || 'No especificado'}</p>
            <p>Email: {currentUser.email}</p>
          </div>
          <button onClick={() => navigate('/editar-perfil')}>Editar Perfil</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}
*/


import { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../pages/Perfil.css'

export default function Perfil() {
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [mostrarCuadroTexto, setMostrarCuadroTexto] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cuadradoActivo, setCuadradoActivo] = useState(false);

  useEffect(() => {
    const obtenerPerfilUsuario = async () => {
      try {
        const docRef = doc(db, 'Estudiante', 'DUjsU6u31sbKv3xg1dWeBfZoa7I3');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPerfilUsuario(docSnap.data());
        } else {
          console.log('No se encontró un perfil de usuario con el ID especificado.');
        }
      } catch (error) {
        console.error('Error al obtener el perfil de usuario:', error);
      }
    };

    obtenerPerfilUsuario();
  }, []);

  useEffect(() => {
    if (perfilUsuario) {
      setNombre(perfilUsuario.nombre);
      setApellido(perfilUsuario.apellido);
      setTelefono(perfilUsuario.telefono);
      setCorreo(perfilUsuario.email);
      setContrasena(perfilUsuario.contra);
    }
  }, [perfilUsuario]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleChangeFoto = () => {
    setMostrarCuadroTexto(true);
    setMostrarConfirmacion(false);
  };

  const handleAceptar = async () => {
    try {
      const docRef = doc(db, 'Estudiante', 'DUjsU6u31sbKv3xg1dWeBfZoa7I3');
      await updateDoc(docRef, { fdp: nuevaFoto });
      setPerfilUsuario({ ...perfilUsuario, fdp: nuevaFoto });
      setNuevaFoto('');
      setMostrarCuadroTexto(false);
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
    }
  };

  const handleCancelar1 = () => {
    setNuevaFoto('');
    setMostrarCuadroTexto(false);
    setMostrarConfirmacion(false);
    // Restablecer los valores del perfil
    if (perfilUsuario) {
      setNombre(perfilUsuario.nombre);
      setApellido(perfilUsuario.apellido);
      setTelefono(perfilUsuario.telefono);
      setCorreo(perfilUsuario.email);
      setContrasena(perfilUsuario.contra);
    }
  };

  const handleCancelar = () => {
    setNuevaFoto('');
    setMostrarCuadroTexto(false);
    setMostrarConfirmacion(false);
  };

  const handleEliminarFoto = () => {
    setMostrarConfirmacion(true);
    setMostrarCuadroTexto(false);
  };

  const handleAceptarEliminar = async () => {
    try {
      const docRef = doc(db, 'Estudiante', 'DUjsU6u31sbKv3xg1dWeBfZoa7I3');
      await updateDoc(docRef, {
        fdp:
          'https://www.cenieh.es/sites/default/files/default_images/Foto%20perfil%20anonimo_0.png',
      });
      setPerfilUsuario({
        ...perfilUsuario,
        fdp:
          'https://www.cenieh.es/sites/default/files/default_images/Foto%20perfil%20anonimo_0.png',
      });
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error('Error al eliminar la foto de perfil:', error);
    }
  };

  if (!perfilUsuario) {
    return <div>Cargando perfil de usuario...</div>;
  }
  

  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
  };
  
  const handleChangeApellido = (e) => {
    setApellido(e.target.value);
  };
  
  const handleChangeTelefono = (e) => {
    setTelefono(e.target.value);
  };
  
  const handleChangeCorreo = (e) => {
    setCorreo(e.target.value);
  };
  
  const handleChangeContrasena = (e) => {
    setContrasena(e.target.value);
  };

  const handleActualizarPerfil = async () => {
    try {
      const docRef = doc(db, 'Estudiante', 'DUjsU6u31sbKv3xg1dWeBfZoa7I3');
      await updateDoc(docRef, {
        nombre,
        apellido,
        telefono,
        email: correo,
        contra: contrasena
      });
      setPerfilUsuario({
        ...perfilUsuario,
        nombre,
        apellido,
        telefono,
        email: correo,
        contra: contrasena
      });
      // Restablecer los valores originales
      setNombre(perfilUsuario.nombre);
      setApellido(perfilUsuario.apellido);
      setTelefono(perfilUsuario.telefono);
      setCorreo(perfilUsuario.email);
      setContrasena(perfilUsuario.contra);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  const handleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
    setCuadradoActivo(!cuadradoActivo);
  };

  return (
    <div className="perfil-container">
      <section className="left-section">
        <div className="profile-picture">
          <img src={perfilUsuario.fdp} alt="Foto de perfil" />
        </div>
        <button onClick={handleChangeFoto}>Cambiar Foto</button>
        {mostrarCuadroTexto && (
          <div className="cambiar-foto">
            <input
              type="text"
              value={nuevaFoto}
              onChange={(e) => setNuevaFoto(e.target.value)}
            />
            <div className="Aceptar-Cancelar">
              <button onClick={handleAceptar}>Aceptar</button>
              <button onClick={handleCancelar}>Cancelar</button>
            </div>
          </div>
        )}
        <button onClick={handleEliminarFoto}>Eliminar Foto</button>
        {mostrarConfirmacion && (
          <div className="eliminar-foto">
            <p className="confirmacion-texto">¿Estás seguro que deseas eliminar tu foto de perfil?</p>
            <div className="Aceptar-Cancelar">
              <button onClick={handleAceptarEliminar}>Aceptar</button>
              <button onClick={handleCancelar}>Cancelar</button>
            </div>
          </div>
        )}
      </section>
      <section className="right-section">
  <h1>Perfil</h1>
  {perfilUsuario ? (
    <>
      <p>
        Nombre:
        <input type="text" value={nombre} onChange={handleChangeNombre} />
      </p>
      <p>
        Apellido:
        <input type="text" value={apellido} onChange={handleChangeApellido} />
      </p>
      <p>
        Teléfono:
        <input type="text" value={telefono} onChange={handleChangeTelefono} />
      </p>
      <p>
        Correo:
        <input type="text" value={correo} onChange={handleChangeCorreo} />
      </p>
      <p>
        Contraseña:
        <input
          type={mostrarContrasena ? 'text' : 'password'}
          value={contrasena}
          onChange={handleChangeContrasena}
        />
      </p>
      <div className="cuadrado-container">
        <div className={`cuadrado ${cuadradoActivo ? 'activo' : ''}`} onClick={handleMostrarContrasena}></div>
        <span className="mostrar-contrasena">Mostrar contraseña</span>
      </div>
      <button onClick={handleActualizarPerfil}>Actualizar perfil</button>
      <button onClick={handleCancelar1}>Cancelar</button>
    </>
  ) : (
    <p>Cargando perfil de usuario...</p>
  )}
      </section>
    </div>
  );
}

