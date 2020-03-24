import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from '../translate/translation';

@Injectable()
export class TranslateService {
    private _currentLang: string;

    public get currentLang() {
        return this._currentLang;
    }

    constructor(@Inject(TRANSLATIONS) private _translations: any) {
    }

    public use(lang: string): void {
        // set current language
        this._currentLang = lang;
    }

    private translate(key: string): string {
        // private perform translation
        let translation = key;

        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }

        return translation;
    }

    public instant(key: string) {
        // call translation
        return this.translate(key);
    }

    private englishTranslate(key: string): string {
        // private perform translation
        let translation = key;

        if (this._translations['en'] && this._translations['en'][key]) {
            return this._translations['en'][key];
        }

        return translation;
    }

    public englishInstant(key: string) {
        // call translation
        return this.englishTranslate(key);
    }

}
