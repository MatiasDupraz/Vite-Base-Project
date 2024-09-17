import React, { useEffect } from "react";

const ModoCheckout = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = " https://ecommerce-modal.preprod.modo.com.ar/bundle.jsx";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("ModoSDK script loaded");
    };

    script.onerror = () => {
      console.error("Error loading ModoSDK script");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function createPaymentIntention() {
    const res = await fetch(
      "https://backend-de-la-tienda.com/api/modo-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: 77 }),
      }
    );

    const jsonRes = await res.json();
    return {
      checkoutId: jsonRes.id,
      qrString: jsonRes.qr,
      deeplink: jsonRes.deeplink,
    };
  }

  async function showModal() {
    const modalData = await createPaymentIntention();
    var modalObject = {
      qrString: modalData.qrString,
      checkoutId: modalData.checkoutId,
      deeplink: {
        url: modalData.deeplink,
        callbackURL: "https://tiendadeprueba.com/checkout", // URL donde redirecciona en caso de que el pago falle
        callbackURLSuccess: "https://tiendadeprueba/thankyou", // URL donde redirecciona en caso de que el pago sea exitoso
      },
      callbackURL: "https://tiendadeprueba/thankyou",
      refreshData: createPaymentIntention, // Función que se ejecuta cuando el usuario selecciona Generar nuevo QR posterior a que un pago falle
      onSuccess: function () {
        // Se ejecuta cuando el pago es exitoso
        console.log("onSuccess");
      },
      onFailure: function () {
        // Se ejecuta cuando el pago falla
        console.log("onFailure");
      },
      onCancel: function () {
        // Se ejecuta cuando el pago es cancelado desde el botón de Cancelación
        console.log("onCancel");
      },
      onClose: function () {
        // Se ejecuta cuando se cierra el modal de MODO desde la cruz
        console.log("onClose");
      },
    };

    if (window.ModoSDK) {
      window.ModoSDK.modoInitPayment(modalObject);
    } else {
      console.error("ModoSDK is not available");
    }
  }

  return (
    <div className="pt-80">
      <button onClick={showModal}>Pagá con MODO</button>
    </div>
  );
};

export default ModoCheckout;
