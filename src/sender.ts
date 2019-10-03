export interface SendArgs {
  title?: string;
  date?: Date;
  url?: string;
  forwardedFor?: string;
  imageUrls?: Array<string>;

  content: string;
  short?: string;
}

export interface ISender {
  // returns the item URL
  send(sendArgs: SendArgs): Promise<string>;
}
