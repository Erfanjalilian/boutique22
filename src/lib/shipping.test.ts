import test from "node:test";
import assert from "node:assert/strict";
import { getAvailableShippingMethods, getShippingCost, ShippingMethod, isQomAddress } from "./shipping";

test("returns pickup + poste_tajazzi for Qom, tipax + poste_tajazzi for others", () => {
  assert.equal(isQomAddress("قم", "قم"), true);
  assert.equal(isQomAddress("تهران", "تهران"), false);

  assert.deepEqual(getAvailableShippingMethods("قم", "قم"), [ShippingMethod.PICKUP, ShippingMethod.POSTE_TAJAZZY]);
  assert.deepEqual(getAvailableShippingMethods("تهران", "تهران"), [ShippingMethod.TIPAX, ShippingMethod.POSTE_TAJAZZY]);
  assert.equal(getShippingCost(ShippingMethod.PICKUP), 30000);
  assert.equal(getShippingCost(ShippingMethod.TIPAX), 0);
  assert.equal(getShippingCost(ShippingMethod.POSTE_TAJAZZY), 100000);
  assert.equal(getShippingCost(ShippingMethod.POSTE_TAJAZZY, {}, 1), 100000);
  assert.equal(getShippingCost(ShippingMethod.POSTE_TAJAZZY, {}, 0.5), 100000);
  assert.equal(getShippingCost(ShippingMethod.POSTE_TAJAZZY, {}, 1.1), 150000);
  assert.equal(getShippingCost(ShippingMethod.POSTE_TAJAZZY, {}, 3), 200000);
});