export interface UsersTrack {
  _id: string,
  createdDate: Date,
  description: string,
  ownerId: string,
  track: Track,
}
export interface Track {
  _id: string,
  trackNumber: string,
  createdBy: string,
  createdDate: Date,
  fromChinaToAlmaty: Date,
  receivedInAlmatyDate: Date,
  shippedFromAlmatyDate: Date,
  receivedInChinaDate: Date,
  receivedByClient: Date
}
