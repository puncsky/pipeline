export interface SendArgs {
  title?: string;
  date?: Date;
  url?: string;
  forwardedFor?: string;
  imageUrls?: Array<string>;
  short?: string;
  unsubscribeGroup?: number;

  content: string;
  pinImageUrl?: string;
  generateTextImage?: boolean;
}

export interface ISender {
  // returns the item URL
  send(sendArgs: SendArgs): Promise<string | boolean>;
}
