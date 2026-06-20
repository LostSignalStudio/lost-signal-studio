const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

// === ВСТАВЬТЕ ВАШ ТОКЕН ЗДЕСЬ ===
const TOKEN = process.env.TOKEN;

client.once(Events.ClientReady, () => {
    console.log(`✅ Бот ${client.user.tag} готов к работе!`);
});

// === ОБРАБОТКА НАЖАТИЙ НА КНОПКИ ===
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const [action, applicationId] = interaction.customId.split('_');

    // Делаем кнопки неактивными (чтобы нельзя было нажать дважды)
    const row = ActionRowBuilder.from(interaction.message.components[0]);
    row.components.forEach(button => button.setDisabled(true));

    if (action === 'accept') {
        // === ЛОГИКА ПРИНЯТИЯ ===
        const member = interaction.member;
        const roleName = 'Сотрудник'; // Название вашей роли на сервере

        let role = interaction.guild.roles.cache.find(r => r.name === roleName);
        
        // Если роли нет — создаём её
        if (!role) {
            role = await interaction.guild.roles.create({
                name: roleName,
                color: '#8B5CF6',
                reason: 'Роль для сотрудников студии'
            });
        }

        try {
            await member.roles.add(role);
            await interaction.update({
                content: `✅ Заявка #${applicationId} **принята** пользователем ${interaction.user.tag}`,
                embeds: interaction.message.embeds,
                components: [row]
            });
        } catch (error) {
            console.error('Ошибка при выдаче роли:', error);
            await interaction.update({
                content: `❌ Ошибка при принятии заявки #${applicationId}`,
                embeds: interaction.message.embeds,
                components: [row]
            });
        }

    } else if (action === 'decline') {
        // === ЛОГИКА ОТКЛОНЕНИЯ ===
        await interaction.update({
            content: `❌ Заявка #${applicationId} **отклонена** пользователем ${interaction.user.tag}`,
            embeds: interaction.message.embeds,
            components: [row]
        });
    }
});

// === ЗАПУСК БОТА ===
client.login(TOKEN);