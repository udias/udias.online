/**
 * # Utility: Adapter
 *
 * Use shims and polyfills
 */

if (!window.RTCPeerConnection) {
  window.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection
}
