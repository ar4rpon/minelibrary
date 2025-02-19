<?php

namespace App\Enums;

enum ReadStatus: string
{
    case WANTREAD = 'want_read';
    case READING = 'reading';
    case DONEREAD = 'done_read';

    public function label(): string
    {
        return match ($this) {
            self::WANTREAD => '読みたい',
            self::READING => '読んでる',
            self::DONEREAD => '読んだ',
        };
    }
}
