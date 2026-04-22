#!/bin/sh
set -e

# ── VPN connection ────────────────────────────────────────────────────────────
if [ -n "$VPN_TOTP_SECRET" ] && [ -n "$VPN_CONFIG_B64" ]; then
    echo "[VPN] Generating TOTP..."
    TOTP=$(oathtool --totp -b "$VPN_TOTP_SECRET")

    echo "[VPN] Writing auth file..."
    printf '%s\n%s%s\n' "$VPN_USERNAME" "${VPN_PASSWORD}${TOTP}" > /tmp/vpn-auth.txt

    echo "[VPN] Writing config..."
    echo "$VPN_CONFIG_B64" | base64 -d > /tmp/client.ovpn

    echo "[VPN] Starting OpenVPN..."
    openvpn --config /tmp/client.ovpn \
            --auth-user-pass /tmp/vpn-auth.txt \
            --daemon \
            --log /tmp/vpn.log \
            --writepid /tmp/vpn.pid \
            --connect-retry 5 \
            --connect-retry-max 3

    # Wait up to 30s for tun0 to appear
    echo "[VPN] Waiting for tunnel interface..."
    i=0
    while [ $i -lt 15 ]; do
        if ip link show tun0 > /dev/null 2>&1; then
            echo "[VPN] tun0 is up — connected."
            break
        fi
        sleep 2
        i=$((i + 1))
    done

    if ! ip link show tun0 > /dev/null 2>&1; then
        echo "[VPN] WARNING: tun0 not detected after 30s. VPN log:"
        cat /tmp/vpn.log || true
    fi

    rm -f /tmp/vpn-auth.txt
else
    echo "[VPN] No VPN env vars set — skipping VPN."
fi

# ── Django startup ────────────────────────────────────────────────────────────
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear

exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 2 \
    --timeout 120
