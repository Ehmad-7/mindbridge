window.MindBridgeAdapters = {

  adapters: [],

  /* =====================================
  Register Adapter
  ====================================== */

  register(adapter) {

    this.adapters.push(
      adapter
    )

    console.log(
      "Adapter registered:",
      adapter.name
    )

  },

  /* =====================================
  Get All Adapters
  ====================================== */

  getAdapters() {

    return this.adapters

  }

}