# Dispatch

Open source OTA updates.

## About

A web-based platform for managing OTA updates focused on simplicity, ease of use, and self-hosting.

Uses Hawkbit DDI API as a wire format so is compatible with RAUC and SWUpdate.

Very much in Alpha.


## Roadmap
- [x] CRUD devices
- [x] CRUD images
- [x] CRUD image versions
- [x] (DDI) wire up basic API
- [x] Set up object storage
- [ ] Add artifact model to image versions
- [ ] Link artifacts to objects
- [x] (DDI) poll deployments
- [ ] (DDI) send deployment base
- [x] (DDI) send installed base
- [ ] (DDI) deployment feedback
- [ ] (DDI) send artifacts
- [ ] (DDI) send config data
- [x] (DDI) auth guard
- [ ] Updating device state
- [ ] Hardware types and compatibility
- [ ] Maintain integrity with deletion
- [ ] Device groups
- [ ] Rollouts

## License

[AGPL-3.0](LICENSE)