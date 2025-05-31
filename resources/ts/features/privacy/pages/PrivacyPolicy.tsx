import DefaultLayout from '@/layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

/**
 * プライバシーポリシーページ
 * アプリケーションのプライバシーポリシーを表示する
 */
export default function PrivacyPolicy() {
  return (
    <DefaultLayout header="プライバシーポリシー">
      <Head title="プライバシーポリシー | MineLibrary" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-6 py-8 sm:p-8">
            <div className="prose prose-green prose-lg max-w-none">
              <p className="mb-8 text-sm italic text-gray-500">
                最終更新日: 2025年3月1日
              </p>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  1. はじめに
                </h2>
                <p className="leading-relaxed text-gray-700">
                  MineLibrary（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                  このプライバシーポリシーでは、当サービスがどのように個人情報を収集、使用、保護するかについて説明します。
                  当サービスを利用することにより、このプライバシーポリシーに記載されている情報の収集と使用に同意したものとみなされます。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  2. 収集する情報
                </h2>
                <p className="mb-3 text-gray-700">
                  当サービスでは、以下の情報を収集することがあります：
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex">
                    <span className="mr-1 font-semibold text-green-800">
                      アカウント情報：
                    </span>
                    <span>
                      ユーザー登録時に、お名前、メールアドレス、パスワードなどの情報を収集します。
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-1 font-semibold text-green-800">
                      プロフィール情報：
                    </span>
                    <span>
                      ユーザーが任意で提供するプロフィール情報（プロフィール画像など）を収集することがあります。
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-1 font-semibold text-green-800">
                      利用データ：
                    </span>
                    <span>
                      本の検索履歴、読書状況、お気に入り登録、読書メモなど、サービス利用に関するデータを収集します。
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-1 font-semibold text-green-800">
                      デバイス情報：
                    </span>
                    <span>
                      IPアドレス、ブラウザの種類、デバイスの種類、オペレーティングシステム、アクセス日時などの技術的情報を収集することがあります。
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-1 font-semibold text-green-800">
                      クッキー情報：
                    </span>
                    <span>
                      当サービスでは、ユーザー体験の向上のためにクッキーを使用することがあります。
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  3. 情報の利用目的
                </h2>
                <p className="mb-3 text-gray-700">
                  収集した情報は、以下の目的で利用されます：
                </p>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  <li>当サービスの提供・維持・改善</li>
                  <li>ユーザーアカウントの管理</li>
                  <li>ユーザーの本棚、お気に入り、読書メモなどの機能の提供</li>
                  <li>サービスに関する重要なお知らせの送信</li>
                  <li>不正利用の防止とセキュリティの確保</li>
                  <li>利用状況の分析によるサービス改善</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  4. 情報の共有と開示
                </h2>
                <p className="mb-3 text-gray-700">
                  当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有または開示することはありません：
                </p>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  <li>ユーザーの同意がある場合</li>
                  <li>法律による要請や法的手続きに応じる必要がある場合</li>
                  <li>当サービスの利用規約を執行する必要がある場合</li>
                  <li>
                    当サービス、ユーザー、または公共の権利、財産、安全を保護する必要がある場合
                  </li>
                  <li>
                    サービス提供に必要なサードパーティプロバイダー（ホスティングサービスなど）と共有する場合
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  5. 情報の保護
                </h2>
                <p className="leading-relaxed text-gray-700">
                  当サービスは、ユーザーの個人情報を不正アクセス、改ざん、漏洩、破損から保護するために、
                  適切な技術的・組織的措置を講じています。ただし、インターネット上での送信や電子的保存方法は
                  100%安全ではないため、絶対的なセキュリティを保証することはできません。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  6. ユーザーの権利
                </h2>
                <p className="mb-3 text-gray-700">
                  ユーザーには以下の権利があります：
                </p>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  <li>個人情報へのアクセス権</li>
                  <li>個人情報の訂正・更新権</li>
                  <li>個人情報の削除権（アカウント削除を含む）</li>
                  <li>個人情報の処理に対する異議申し立て権</li>
                  <li>データポータビリティの権利</li>
                </ul>
                <p className="mt-3 text-gray-700">
                  これらの権利を行使するには、下記の「お問い合わせ先」までご連絡ください。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  7. クッキーとトラッキング技術
                </h2>
                <p className="leading-relaxed text-gray-700">
                  当サービスでは、ユーザー体験の向上、サービスの利用状況の分析、広告の最適化などを目的として、
                  クッキーおよび類似の技術を使用することがあります。ほとんどのウェブブラウザでは、クッキーの受け入れを
                  制御することができます。ただし、クッキーを無効にすると、当サービスの一部の機能が正常に動作しなくなる
                  可能性があります。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  8. 第三者サービス
                </h2>
                <p className="leading-relaxed text-gray-700">
                  当サービスは、Amazon、楽天などの外部サイトへのリンクを提供しています。これらの第三者サイトには
                  独自のプライバシーポリシーがあり、当サービスのプライバシーポリシーとは異なる場合があります。
                  ユーザーがこれらのサイトを訪問する際は、各サイトのプライバシーポリシーを確認することをお勧めします。
                  当サービスは、第三者サイトのコンテンツやプライバシー慣行について責任を負いません。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  9. 子どものプライバシー
                </h2>
                <p className="leading-relaxed text-gray-700">
                  当サービスは、13歳未満の子どもを対象としていません。13歳未満の子どもから個人情報を
                  故意に収集することはありません。13歳未満の子どもが当サービスに個人情報を提供していることが
                  判明した場合は、速やかにその情報を削除するための措置を講じます。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  10. プライバシーポリシーの変更
                </h2>
                <p className="leading-relaxed text-gray-700">
                  当サービスは、必要に応じてこのプライバシーポリシーを更新することがあります。
                  変更があった場合は、更新日を更新し、重要な変更については当サービス上で通知します。
                  定期的にこのページを確認して、プライバシーポリシーの変更を把握することをお勧めします。
                  変更後も当サービスを継続して利用することにより、更新されたプライバシーポリシーに同意したものとみなされます。
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  11. お問い合わせ先
                </h2>
                <p className="mb-3 text-gray-700">
                  このプライバシーポリシーに関するご質問やご意見、または個人情報に関するリクエストについては、
                  以下の連絡先までお問い合わせください：
                </p>
                <div className="inline-block rounded-md border border-gray-200 bg-gray-50 p-4">
                  <p className="text-gray-700">
                    Eメール:{' '}
                    <a
                      href="mailto:hsgw28tech@gmail.com"
                      className="text-green-600 hover:underline"
                    >
                      hsgw28tech@gmail.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
