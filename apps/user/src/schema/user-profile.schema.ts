import { BaseDocument, Gender, zodiacSigns } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Profile extends BaseDocument {
  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  accountId: string;

  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Prop({ type: SchemaTypes.String, required: true, enum: Gender })
  gender: string;

  @Prop({ type: SchemaTypes.Date, required: true })
  birthday: Date;

  @Prop({ type: SchemaTypes.String })
  horoscope: string;

  @Prop({ type: SchemaTypes.String })
  zodiac: string;

  @Prop({ type: SchemaTypes.Number, required: true })
  height: number;

  @Prop({ type: SchemaTypes.Number, required: true })
  weight: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.pre('save', function (next) {
  if (this.birthday) {
    const monthDay = this.birthday.toISOString().slice(5, 10);
    const findZodiacSign = zodiacSigns.find(
      (item) => monthDay >= item.start && monthDay <= item.end,
    );

    this.horoscope = findZodiacSign.horoscope;
    this.zodiac = findZodiacSign.zodiac;
  }

  next();
});
