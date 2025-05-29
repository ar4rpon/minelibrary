<?php

namespace Tests\Helpers;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

trait DatabaseTestHelper
{
    use RefreshDatabase;

    /**
     * テスト用のシードデータを実行
     *
     * @param string|array $seederClass
     * @return void
     */
    protected function seedTestData($seederClass): void
    {
        if (is_array($seederClass)) {
            foreach ($seederClass as $seeder) {
                $this->seed($seeder);
            }
        } else {
            $this->seed($seederClass);
        }
    }

    /**
     * トランザクション内でテストを実行
     *
     * @param callable $callback
     * @return mixed
     */
    protected function withinTransaction(callable $callback)
    {
        return DB::transaction(function () use ($callback) {
            return $callback();
        });
    }

    /**
     * データベースに特定のレコードが存在することを確認
     *
     * @param string $table
     * @param array $data
     * @param string|null $connection
     * @return void
     */
    protected function assertDatabaseHasExact(string $table, array $data, ?string $connection = null): void
    {
        $count = DB::connection($connection)
            ->table($table)
            ->where($data)
            ->count();

        $this->assertEquals(1, $count, "Failed asserting that exactly one row in table [{$table}] matches the attributes.");
    }

    /**
     * データベースにレコードが存在しないことを確認
     *
     * @param string $table
     * @param string|null $connection
     * @return void
     */
    protected function assertDatabaseIsEmpty(string $table, ?string $connection = null): void
    {
        $count = DB::connection($connection)
            ->table($table)
            ->count();

        $this->assertEquals(0, $count, "Failed asserting that table [{$table}] is empty.");
    }

    /**
     * データベースのレコード数を確認
     *
     * @param string $table
     * @param int $expectedCount
     * @param array $where
     * @param string|null $connection
     * @return void
     */
    protected function assertDatabaseRecordCount(string $table, int $expectedCount, array $where = [], ?string $connection = null): void
    {
        $query = DB::connection($connection)->table($table);
        
        if (!empty($where)) {
            $query->where($where);
        }
        
        $actual = $query->count();

        $this->assertEquals($expectedCount, $actual, "Failed asserting that table [{$table}] contains {$expectedCount} records.");
    }

    /**
     * ソフトデリートされたレコードが存在することを確認
     *
     * @param string $model
     * @param array $data
     * @return void
     */
    protected function assertSoftDeleted(string $model, array $data): void
    {
        $instance = new $model;
        $table = $instance->getTable();
        
        $count = DB::table($table)
            ->where($data)
            ->whereNotNull('deleted_at')
            ->count();

        $this->assertGreaterThan(0, $count, "Failed asserting that a soft deleted row in table [{$table}] matches the attributes.");
    }
}