//import { setupDayNightTriggers } from './common/astro';

let INDICATOR_ID_PLUGGED: number = 3;
let INDICATOR_ID_CHARGING: number = 3;
let BLINKRATE_CHARGING: number = 0;
let BLINKRATE_PLUGGED: number = 0;
let COLOR_BEV_CHARGING: string = "#81D8E1"; // light blueish
let COLOR_BEV_PLUGGED: string = "#FA9B2D";  // orange
let FADERATE_CHARGING: number = 2000;
let FADERATE_PLUGGED: number = 0;
let CT_ID_CHARGING: number = 0; // CT stands for Chargepoint
let CT_ID_PLUG: number = 11;    // CT stands for Chargepoint
let topic_openWB_charging: string = `mqtt.1.openWB.internal_chargepoint.${CT_ID_CHARGING}.get.charge_state`;
let topic_openWB_plugged: string = `mqtt.1.openWB.chargepoint.${CT_ID_PLUG}.get.plug_state`;

let BEV_Charge_state;
let BEV_Plugged_state;

// HLL - high level-logic: only if charing is not active, then visualize if the BEV is plugged-in.

// INIT
//setupDayNightTriggers().catch(console.error);
BEV_Charge_state = getState(topic_openWB_charging).val;
BEV_Plugged_state = getState(topic_openWB_plugged).val;


// EVENTS
on({ id: [].concat([topic_openWB_charging]), change: 'ne' }, async (obj) => {
    const value = obj.state.val;
    const oldValue = obj.oldState.val;
    BEV_Charge_state = getState(topic_openWB_charging).val;
    BEV_Plugged_state = getState(topic_openWB_plugged).val;
    console.info(`CHARGING ACTIVE?: ${BEV_Charge_state} and of course, PLUGGED?: ${BEV_Plugged_state}.`);

    if (value) {
        setDelayedStates(INDICATOR_ID_CHARGING, BEV_Charge_state, BLINKRATE_CHARGING, COLOR_BEV_CHARGING, FADERATE_CHARGING);
    } else if (oldValue) {
        setDelayedStates(INDICATOR_ID_PLUGGED, BEV_Plugged_state, BLINKRATE_PLUGGED, COLOR_BEV_PLUGGED, FADERATE_PLUGGED);
    }
});

on({ id: [].concat([topic_openWB_plugged]), change: 'ne' }, async (obj) => {
  let value2 = obj.state.val;
  let oldValue2 = obj.oldState.val;
  BEV_Plugged_state = getState(topic_openWB_plugged).val;
  console.info(`BEV PLUGGED?: ${BEV_Plugged_state}.`);
  if(!BEV_Charge_state){
    setDelayedStates(INDICATOR_ID_PLUGGED, BEV_Plugged_state, BLINKRATE_PLUGGED, COLOR_BEV_PLUGGED, FADERATE_PLUGGED);
}});

function setDelayedStates(indicatorId, stateValue, blinkRate, color, fadeRate) {
    setStateDelayed(`awtrix-light.0.indicator.${indicatorId}.active`, stateValue, false, 0, false);
    setStateDelayed(`awtrix-light.0.indicator.${indicatorId}.blink`, blinkRate, false, 0, false);
    setStateDelayed(`awtrix-light.0.indicator.${indicatorId}.color`, color, false, 0, false);
    setStateDelayed(`awtrix-light.0.indicator.${indicatorId}.fade`, fadeRate, false, 0, false);
}

