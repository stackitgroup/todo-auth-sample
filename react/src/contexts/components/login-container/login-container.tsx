import { authService } from "@/contexts/features/auth/application/auth.service";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../common/action-button/action-button";

export const LoginContainer = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="container">
            <h2 className="">{t('interact_with_app')}?</h2>
            <input
                type="number"
                placeholder={t('user_id')}
                className='input my-20 w-full max-w-xs'
                onChange={handleInput}
                value={inputValue}
            />
            <ActionButton onClick={() => authService.create({ userId: inputValue })} disabled={false}>
                {t('log_in')}
            </ActionButton>
        </div>
    )
}