/* Sincronización presentación ↔ celular por MQTT (broker público EMQX, conexión permanente por WebSocket).
   Solo viaja el número de diapositiva. El último estado queda retenido en el broker,
   así quien se conecta después llega directo a la diapositiva actual. */
window.Sinc = function (sala, alRecibir, alEstado, op) {
  op = op || {};
  var yo = Math.random().toString(36).slice(2, 10);
  var tema = 'soyandresarango/tutoria/' + sala;
  var cli = null, ult = {};
  if (!sala || !window.mqtt) { if (alEstado) alEstado(false); return { enviar: function () {} }; }
  try {
    cli = window.mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: 'fa_' + yo, clean: true, keepalive: 30, reconnectPeriod: 2500, connectTimeout: 10000
    });
    cli.on('connect', function () { if (alEstado) alEstado(true); cli.subscribe(tema, { qos: 1 }); if (op.alConectar) op.alConectar(); });
    cli.on('reconnect', function () { if (alEstado) alEstado(false); });
    cli.on('close', function () { if (alEstado) alEstado(false); });
    cli.on('offline', function () { if (alEstado) alEstado(false); });
    cli.on('message', function (t, carga, paquete) {
      if (op.ignorarRetenido && paquete && paquete.retain) return;
      var m; try { m = JSON.parse(String(carga)); } catch (e) { return; }
      if (!m || m.o === yo || typeof m.n !== 'number') return;
      var o = m.o || '?';
      if (m.t && m.t <= (ult[o] || 0)) return;
      ult[o] = m.t || 0;
      alRecibir(m);
    });
  } catch (e) { if (alEstado) alEstado(false); }
  return {
    enviar: function (obj) {
      if (!cli || !cli.connected) return;
      obj.o = yo; obj.t = Date.now();
      try { cli.publish(tema, JSON.stringify(obj), { qos: 1, retain: true }); } catch (e) {}
    }
  };
};
