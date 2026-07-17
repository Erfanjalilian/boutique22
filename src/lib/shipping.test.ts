import test from "node:test";
import assert from "node:assert/strict";
import { getAvailableShippingMethods, getShippingCost, ShippingMethod, isQomAddress } from "./shipping";

test("returns pickup for addresses in Qom and tipax for others", () => {
  assert.equal(isQomAddress("قم", "قم"), true);
  assert.equal(isQomAddress("تهران", "تهران"), false);

  assert.deepEqual(getAvailableShippingMethods("قم", "قم"), [ShippingMethod.PICKUP]);
  assert.deepEqual(getAvailableShippingMethods("تهران", "تهران"), [ShippingMethod.TIPAX]);
  assert.equal(getShippingCost(ShippingMethod.PICKUP), 30000);
  assert.equal(getShippingCost(ShippingMethod.TIPAX), 0);
});
