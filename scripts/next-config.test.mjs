import assert from "node:assert/strict";
import { networkInterfaces } from "node:os";
import test from "node:test";

import nextConfig from "../next.config.mjs";

function activeLanAddresses() {
  return Object.values(networkInterfaces())
    .flatMap((addresses) => addresses ?? [])
    .filter(
      (address) =>
        address.family === "IPv4" && !address.internal && address.address,
    )
    .map((address) => address.address);
}

test("the development server accepts loopback browser origins", () => {
  assert.ok(nextConfig.allowedDevOrigins?.includes("127.0.0.1"));
});

test("the development server accepts this machine's active LAN origins", () => {
  for (const address of activeLanAddresses()) {
    assert.ok(
      nextConfig.allowedDevOrigins?.includes(address),
      `expected ${address} in allowedDevOrigins`,
    );
  }
});
